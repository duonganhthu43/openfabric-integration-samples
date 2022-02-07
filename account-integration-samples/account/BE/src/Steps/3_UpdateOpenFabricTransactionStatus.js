import axios from "axios";
import {
  AccountClientId,
  AccountClientSecret,
  OpenFabricApiEndpoint,
} from "../Enviroment";
import { OpenFabricAuthentication } from "./2_OpenFabricAuthentication";
export const UpdateOpenFabricTransactionStatus = async ({
  account_reference_id,
  status,
  reason,
}) => {
  const clientCredentialToken = await OpenFabricAuthentication({
    account_client_id: AccountClientId,
    account_client_secrect: AccountClientSecret,
  });
  // call update status to OpenFabric System
  const result = await axios.put(`${OpenFabricApiEndpoint}/t/transactions`, {
    account_reference_id,
    status,
    reason,
  }, {
    headers: {
      Authorization: `Bearer ${clientCredentialToken}`
    }
  })
  return result.data;
};
