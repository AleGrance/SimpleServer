import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

module.exports = (app) => {
  const apikey = process.env.API_KEY;
  const Users = app.db.models.Users;

  app.route("/api/auth/login").post((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apikey) {
      // Receiving data
      const { userName, userPassword } = req.body;

      if (!userName) {
        return res.status(400).send({
          status: 400,
          message: "El campo userName no puede estar vacío",
        });
      }

      if (!userPassword) {
        return res.status(400).send({
          status: 400,
          message: "El campo userPassword no puede estar vacío",
        });
      }

      Users.findOne({
        where: {
          userName: req.body.userName,
        },
      })
        .then((result) => {
          // If user doesn't exists show message
          if (!result) return res.status(404).send({ message: "El usuario no esta registrado" });

          // If users exists
          // Decrypt
          var bytes = CryptoJS.AES.decrypt(result.userPassword, "secret");
          var passDecrypted = bytes.toString(CryptoJS.enc.Utf8);
          // If passwords do not match show message
          if (req.body.userPassword !== passDecrypted)
            return res
              .status(401)
              .send({ message: "El password es incorrecto", auth: false, token: null });
          // Gen token
          var token = jwt.sign({ id: result.userId }, "secret", { expiresIn: 60 * 60 * 24 });
          res.status(200).send({
            message: "Acceso correcto",
            auth: true,
            token: token,
            userFullname: result.userFullname,
            userId: result.userId,
            roleId: result.roleId,
          });
        })
        .catch((error) => {
          res.send(error);
        });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });
};
