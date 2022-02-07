import express from "express";
import cors from "cors";
import { Port } from "./Enviroment";
import { CreateAccountTransaction } from "./Steps/1_CreateAccountTransaction";
import { UpdateOpenFabricTransactionStatus } from "./Steps/3_UpdateOpenFabricTransactionStatus";
import { GetOpenFabricTransactionDetailsById } from "./Steps/4_GetOpenFabricTransactionDetailsById";

const app = express();
app.set("trust proxy", true);
const options = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
    "Accept-Language",
    "User-Agent",
    "Host",
    "X-Forwarded-For",
  ],
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/account-create-transaction", async (req, res) => {
  const response = await CreateAccountTransaction(req.body);
  return res.status(200).send(response);
});

app.post("/approve-transaction", async (req, res) => {
  try {
    const openfabric_transaction_id = req.body["openfabric_transaction_id"];
    const transactionDetails = await GetOpenFabricTransactionDetailsById({
      openfabric_transaction_id: openfabric_transaction_id,
    });
    console.log('==== transactionDetails ', transactionDetails)
    const account_reference_id = transactionDetails["account_reference_id"];
    const response = await UpdateOpenFabricTransactionStatus({
      account_reference_id: account_reference_id,
      status: "Approved",
      reason: "Approve By customer",
    });
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post("/deny-transaction", async (req, res) => {
  try {
    const openfabric_transaction_id = req.body["openfabric_transaction_id"];
    const transactionDetails = await GetOpenFabricTransactionDetailsById({
      openfabric_transaction_id: openfabric_transaction_id,
    });
    const account_reference_id = transactionDetails["account_reference_id"];
    const response = await UpdateOpenFabricTransactionStatus({
      account_reference_id: account_reference_id,
      status: "Failed",
      reason: "Customer cancel",
    });
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.listen(Port, () => {
  console.log(`Start Auth Endpoint: http://localhost:${Port}`);
});
