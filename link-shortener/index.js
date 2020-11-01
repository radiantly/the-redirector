const express = require("express");
const https = require("https");
const fs = require("fs");
const Links = require("./db");

const app = express();
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/link/:id', async (req, res) => {
    console.log("Hit!");
    const linkData = await Links.findAll({ limit: 1, where: { linkName: req.params.id }});
    if (linkData.length == 0)
        return res.status(404).send("Unable to find page");
    return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta property="og:site_name" content="${linkData[0].linkText}" />
        <meta property="og:title" content="${linkData[0].linkText}" />
        <meta property="og:description" content="${linkData[0].linkDescription}" />
        <meta property="og:image" content="${linkData[0].linkImageUrl}" />
      </head>
      <body>
        <script>
          setTimeout(() => (window.location.href="${linkData[0].linkUrl}"), 1000);
        </script>
      </body>
    </html>
    `);
});

app.post('/savelink', (req, res) => {
    const { linkName, linkUrl, linkText, linkDescription, linkImageUrl } = req.body;
    Links
        .create({ linkName, linkUrl, linkText, linkDescription, linkImageUrl })
        .then(() => res.send("Link created!"));

})

app.listen(80)

https.createServer({
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/certificate.pem')
}, app).listen(443);
