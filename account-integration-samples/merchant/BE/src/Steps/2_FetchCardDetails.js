import axios from "axios";
import {
  AccountClientId,
  AccountClientSecret,
  OpenFabricApiEndpoint,
} from "../Enviroment";
import { OpenFabricAuthentication } from "./1_OpenFabricAuthentication";
export const GetOpenFabricTransactionDetailsById = async ({
  openfabric_transaction_id,
}) => {
  const clientCredentialToken = await OpenFabricAuthentication({
    account_client_id: AccountClientId,
    account_client_secrect: AccountClientSecret,
  });
  // call update status to OpenFabric System
  const result = await axios.get(
    `${OpenFabricApiEndpoint}/t/transactions/${openfabric_transaction_id}/details`,
    {
      headers: {
        Authorization: `Bearer ${clientCredentialToken}`,
      },
    }
  );
  return result;
};
