import axios from "axios";
import {
  AccountClientId,
  AccountClientSecret,
  OpenFabricApiEndpoint,
} from "../Enviroment";
import { OpenFabricAuthentication } from "./2_OpenFabricAuthentication";
export const GetOpenFabricTransactionDetailsById = async ({
  openfabric_transaction_id,
}) => {
  const clientCredentialToken = await OpenFabricAuthentication({
    account_client_id: AccountClientId,
    account_client_secrect: AccountClientSecret,
  });
  const result = await axios.get(
    `${OpenFabricApiEndpoint}/t/transactions/${openfabric_transaction_id}/details`,
    {
      headers: {
        Authorization: `Bearer ${clientCredentialToken.access_token}`,
      },
    }
  );
  return result.data// result;
};
