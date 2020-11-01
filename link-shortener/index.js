const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

app.use(express.static('public'))

// app.post()

app.listen(80)

https.createServer({
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/certificate.pem')
}, app).listen(443);
