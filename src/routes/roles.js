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
          console.log(req.body);
          Roles.create(req.body)
            .then((result) =>
              res.json({
                status: "success",
                body: result,
              })
            )
            .catch((error) =>
              res.json({
                status: "error",
                body: error.errors,
              })
            );
        } else {
          return res.status(403).send({
            error: "Forbidden",
            message: "Cabecera de autorización inválida",
          });
        }
      });
  
    //   app
    //     .route("/api/roles/:role_id")
    //     .get((req, res) => {
    //       Roles.findOne({
    //         where: req.params,
    //         include: [
    //           {
    //             model: Users,
    //           },
    //         ],
    //       })
    //         .then((result) => res.json(result))
    //         .catch((error) => {
    //           res.status(404).json({
    //             msg: error.message,
    //           });
    //         });
    //     })
    //     .put((req, res) => {
    //       Roles.update(req.body, {
    //         where: req.params,
    //       })
    //         .then((result) => res.sendStatus(204))
    //         .catch((error) => {
    //           res.status(412).json({
    //             msg: error.message,
    //           });
    //         });
    //     })
    //     .delete((req, res) => {
    //       //const id = req.params.id;
    //       Roles.destroy({
    //         where: req.params,
    //       })
    //         .then(() => res.json(req.params))
    //         .catch((error) => {
    //           res.status(412).json({
    //             msg: error.message,
    //           });
    //         });
    //     });
  };
  