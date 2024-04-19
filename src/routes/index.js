module.exports = (app) => {
  const apikey = process.env.API_KEY;

  const htmlBody = `
    <div style="text-align: center;">
    <h1>ERROR 404</h1>
    <br>
    <img src="http://i.stack.imgur.com/SBv4T.gif" alt="I choose you!"  width="250" />
    <br>
    <h1>Page not found</h1>
    </div>
    `;

  app.get("/", (req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apikey) {
      res.status(404).send(htmlBody);
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });

  app.route("/api").get((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apikey) {
      res.status(404).send(htmlBody);
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });
};
