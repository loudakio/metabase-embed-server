const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;
const EXPIRATION_SECONDS = process.env.EXPIRATION_SECONDS || 21600;

app.get("/:dashboardId", (req, res) => {
  const dashboardId = parseInt(req.params.dashboardId);

  if (!dashboardId) {
    return res.status(400).send("Dashboard ID inválido.");
  }

  const payload = {
    resource: { dashboard: dashboardId },
    params: {},
    exp: Math.floor(Date.now() / 1000) + parseInt(EXPIRATION_SECONDS)
  };

  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#theme=night&bordered=true&titled=true`;

  res.send(`
    <html>
      <body style="margin:0;padding:0">
        <iframe src="${iframeUrl}" frameborder="0" style="width:100%;height:100vh" allowtransparency></iframe>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
