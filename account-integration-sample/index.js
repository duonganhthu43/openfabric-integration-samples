const path = require('path');
const express = require('express');
const request = require('request');
require('dotenv').config();

const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Set CLIENT_ID, CLIENT_SECRET, GATEWAY_URL, AUTH_END_POINT in the .env file
const auth = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
const basePath = process.env.GATEWAY_URL;
const authEndPoint = process.env.AUTH_URL;

const asyncRequest = (url, options) => new Promise((resolve, reject) =>
    request(url, options, (error, res, body) => {
        if (!error && (res.statusCode > 199) && (res.statusCode < 300)) {
            resolve(body ? JSON.parse(body) : true);
        } else {
            reject(error ?? `HTTP error: ${res.statusCode}`);
        }
    }));

const authOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        /*
         * Authorization header is base64 encoded value
         * of your clientId and clientSecret
        */
        Authorization: `Basic ${auth}`,
    },
    form: { grant_type: 'client_credentials' }
};

const config = (token, method, body) =>
    ({
        method,
        json: !!body,
        body,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

// Render "Approve" and "Cancel" buttons
app.get('/', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        console.error("Missing `id` in query");
        return;
    }
    try {
        const { access_token } = await asyncRequest(authEndPoint, authOptions);
        const transInfo = await asyncRequest(`${basePath}/t/transactions/${id}`, config(access_token, 'GET'));
        res.render("index", {
            account_reference_id: transInfo?.account_reference_id,
            id
        })
    } catch (error) {
        console.error("Index error: ", error);
    }
});

app.post('/approve', async (req, res) => {
    const id = req.body.id;
    if (!id) {
        console.error("Missing `id` in body");
        return;
    }
    try {
        const { access_token } = await asyncRequest(authEndPoint, authOptions);
        const transInfo = await asyncRequest(`${basePath}/t/transactions/${id}`, config(access_token, 'GET'));
        await asyncRequest(`${basePath}/t/transactions`, config(access_token, 'PUT', req.body));
        res.redirect(transInfo.gateway_success_url);
    } catch (error) {
        console.error("Approve error: ", error);
    }
});

app.post('/cancel', async (req, res) => {
    const id = req.body.id;
    if (!id) {
        console.error("Missing `id` in body");
        return;
    }
    try {
        const { access_token } = await asyncRequest(authEndPoint, authOptions);
        const transInfo = await asyncRequest(`${basePath}/t/transactions/${id}`, config(access_token, 'GET'));
        await asyncRequest(`${basePath}/t/transactions`, config(access_token, 'PUT', req.body));
        res.redirect(transInfo.gateway_fail_url);
    } catch (error) {
        console.error("Cancel error: ", error);
    }
});

app.listen(port, () => {
    console.log(`Start Account Server, visit http://localhost:${port}`);
});
