module.exports = (app) => {
  const apikey = process.env.API_KEY;
  const Roles = app.db.models.Roles;

  app
    .route("/api/roles")
    .get((req, res) => {
      if (!req.headers.apikey) {
        return res.status(403).send({
          error: "Forbidden",
          message: "Tu petición no tiene cabecera de autorización",
        });
      }

      if (req.headers.apikey === apikey) {
        Roles.findAll()
          .then((result) => res.json(result))
          .catch((error) => {
            res.status(402).json({
              msg: error.menssage,
            });
          });
      } else {
        return res.status(403).send({
          error: "Forbidden",
          message: "Cabecera de autorización inválida",
        });
      }
    })
    .post((req, res) => {
      if (!req.headers.apikey) {
        return res.status(403).send({
          error: "Forbidden",
          message: "Tu petición no tiene cabecera de autorización",
        });
      }

      if (req.headers.apikey === apikey) {
        const { roleName } = req.body;
        console.log(req.body);

        if (!roleName) {
          return res.status(400).send({
            status: 400,
            message: "El nombre del rol no puede estar vacío",
          });
        }

        Roles.create(req.body)
          .then((result) =>
            res.json({
              status: "success",
              body: result,
            })
          )
          .catch((error) => {
            // console.log(error);

            if (error.name == "SequelizeUniqueConstraintError") {
              res.status(400).send({
                status: 400,
                message: "El nombre ingresado ya existe",
              });
            } else {
              res.json({
                status: "error",
                message: "Error interno del servidor",
              });
            }
          });
      } else {
        return res.status(403).send({
          error: "Forbidden",
          message: "Cabecera de autorización inválida",
        });
      }
    });
};
