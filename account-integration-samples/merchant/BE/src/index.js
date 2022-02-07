import express from "express";
import cors from "cors";
import { Port, MerchantClientId, MerchantClientSecrect } from "./Enviroment";
import { OpenFabricAuthentication } from "./Steps/1_OpenFabricAuthentication";

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
app.get("/merchant-authenticate", async (req, res) => {
  const response = await OpenFabricAuthentication({
    merchant_client_id: MerchantClientId,
    merchant_client_secrect: MerchantClientSecrect,
  });
  return res.status(200).send(response);
});
app.listen(Port, () => {
  console.log(`Start Auth Endpoint: http://localhost:${Port}`);
});
