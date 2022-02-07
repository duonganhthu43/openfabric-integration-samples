import { AccountFEEndpoint } from "../Enviroment";
import { v4 as uuid } from "uuid";

export const CreateAccountTransaction = async (fabricTransactionRequest) => {
  // do some logic in Account system
  // return data for OpenFabric server
  return {
    account_reference_id: uuid(),
    // url for customer redirect to account system
    payment_redirect_web_url: `${AccountFEEndpoint}?of_transaction_id=${fabricTransactionRequest.fabric_reference_id || fabricTransactionRequest.id}`,
  }
};
