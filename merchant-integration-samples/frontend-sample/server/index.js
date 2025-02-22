const path = require("path");
const express = require("express");
const request = require("request");

require('dotenv').config();

const app = express();
const port = 3000;

// Set CLIENT_ID & CLIENT_SECRET in the .env file
const auth = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")

const authOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        /*
         * Authorization header is base64 encoded value
         * of your clientId and clientSecret
        */
        Authorization: `Basic ${auth}`,
    },
    form: { grant_type: "client_credentials" }
};

app.get("/of-auth", (req, res) =>
    request("https://auth.sandbox.openfabric.co/oauth2/token", authOptions, (error, response, body) => {
        if (!error) {
            const bodyJS = JSON.parse(body);
            res.json(bodyJS);
        } else {
            console.error(error);
        }
    }));

app.get('/vanilla', (req, res) =>
    res.sendFile(path.join(__dirname, "public", "vanilla.html")));

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, "..", "build", "index.html")));

app.listen(port, () => {
    console.log(`Check Merchant Integration Sample: http://localhost:${port}`);
});
