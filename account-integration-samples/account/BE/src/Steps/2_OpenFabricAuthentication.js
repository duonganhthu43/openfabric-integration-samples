import axios from "axios";
import { OpenFabricAuthEndpoint } from "../Enviroment";
import qs from "qs";

export const OpenFabricAuthentication = async ({
  account_client_id,
  account_client_secrect,
}) => {
  const base64Token = Buffer.from(
    `${account_client_id}:${account_client_secrect}`
  ).toString("base64");
  var data = qs.stringify({
    grant_type: "client_credentials",
  });
  const result = await axios.post(OpenFabricAuthEndpoint, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64Token}`,
    },
  }).catch(error => {
    console.log('=== error', error)
    return {}
  });
  console.log('=== result', result.data)
  return result.data;
};
