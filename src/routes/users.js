var CryptoJS = require("crypto-js");
const Sequelize = require("sequelize");

/**
 * Loggers
 */

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // Comprimir archivos antiguos
  maxSize: "20m",
  maxFiles: "14d", // Mantener archivos solo por 14 días
});

const logger = winston.createLogger({
  transports: [transport],
});

logger.info("Aplicación iniciada");

// import pino from 'pino';
// import fs from 'fs';

// // Especifica el destino del log
// const logFile = './logs/output.log';

// // Asegúrate de que la carpeta exista antes de intentar escribir en el archivo
// if (!fs.existsSync('./logs')) {
//   fs.mkdirSync('./logs');
// }

// // Configura pino con pino-pretty
// const logger = pino({
//   prettyPrint: true, // Para usar pino-pretty en la consola
// }, pino.destination(logFile));

module.exports = (app) => {
  const apikey = process.env.API_KEY;

  const Users = app.db.models.Users;
  const Roles = app.db.models.Roles;
  const htmlBody = `
  <div style="text-align: center;">
  <h1>ERROR 403</h1>
  <br>
  <img src="http://i.stack.imgur.com/SBv4T.gif" alt="I choose you!"  width="250" />
  <br>
  <h1>Forbidden</h1>
  </div>
  `;

  function validateApiKey(req, res) {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey != apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  }

  app
    .route("/api/users")
    .get((req, res) => {
      if (!req.headers.apikey) {
        return res.status(403).send({
          error: "Forbidden",
          message: "Tu petición no tiene cabecera de autorización",
        });
      }

      if (req.headers.apikey === apikey) {
        Users.findAll({
          attributes: {
            exclude: ["userPassword"],
          },
          include: [
            {
              model: Roles,
              attributes: ["roleName"],
            },
          ],
        })
          .then((result) => res.json(result))
          .catch((error) => {
            res.status(402).json({
              msg: error,
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
        // Receiving data
        const { userName, userPassword, userEmail, userFullname, roleId } =
          req.body;

        if (!userName) {
          return res.status(400).send({
            status: 400,
            message: "El campo userName no puede estar vacío",
          });
        }

        if (!userFullname) {
          return res.status(400).send({
            status: 400,
            message: "El campo userFullname no puede estar vacío",
          });
        }

        if (!userPassword) {
          return res.status(400).send({
            status: 400,
            message: "El campo userPassword no puede estar vacío",
          });
        }

        if (!userEmail) {
          return res.status(400).send({
            status: 400,
            message: "El campo userEmail no puede estar vacío",
          });
        }

        if (!roleId) {
          return res.status(400).send({
            status: 400,
            message: "El campo roleId no puede estar vacío",
          });
        }

        // console.log(req.body);

        /**
         * Logs
         */

        // Log de información
        logger.info(`Usuario ${userName} registrado`);
        // Log de error
        logger.error("Error detectado");

        // Creating new user
        const user = {
          userName: userName,
          userFullname: userFullname,
          userPassword: userPassword,
          userEmail: userEmail,
          roleId: roleId,
        };
        // Encrypting password
        user.userPassword = CryptoJS.AES.encrypt(
          user.userPassword,
          "secret"
        ).toString();
        // Insert new user
        Users.create(user)
          .then((result) =>
            res.json({
              status: "success",
              body: result,
            })
          )
          .catch((error) => {
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

  app
    .route("/users/:userId")
    .get((req, res) => {
      validateApiKey(req, res);

      Users.findOne({
        where: req.params,
        attributes: { exclude: ["userPassword"] },
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(404).json({
            msg: error.message,
          });
        });
    })
    .patch((req, res) => {
      validateApiKey(req, res);

      let user = req.body;

      if (user.userPassword) {
        // Encrypting password
        user.userPassword = CryptoJS.AES.encrypt(
          user.userPassword.toString(),
          "secret"
        ).toString();
      }

      Users.update(user, {
        where: req.params,
      })
        .then((result) =>
          res.json({
            status: "success",
          })
        )
        .catch((error) => res.status(412).json(error.message));
    })

    .delete((req, res) => {
      //const id = req.params.id;
      Users.destroy({
        where: req.params,
      })
        .then(() => res.json(req.params))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    });

  // PAGINATION
  app.route("/api/users-filtered").post((req, res) => {
    if (!req.headers.apikey) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización",
      });
    }

    if (req.headers.apikey === apikey) {
      var search_keyword = req.body.search.value
        .replace(/[^a-zA-Z 0-9.]+/g, "")
        .split(" ");

      return Users.count().then((counts) => {
        var condition = [];

        for (var searchable of search_keyword) {
          if (searchable !== "") {
            condition.push({
              user_name: {
                [Sequelize.Op.iLike]: `%${searchable}%`,
              },
            });
          }
        }

        var result = {
          data: [],
          recordsTotal: 0,
          recordsFiltered: 0,
        };

        if (!counts) {
          return res.json(result);
        }

        result.recordsTotal = counts;

        Users.findAndCountAll({
          offset: req.body.start,
          limit: req.body.length,
          where: {
            [Sequelize.Op.or]:
              condition.length > 0
                ? condition
                : [{ userName: { [Sequelize.Op.iLike]: "%%" } }],
          },
          attributes: {
            exclude: ["userPassword"],
          },
          include: [
            {
              model: Roles,
              attributes: ["roleName"],
            },
          ],
          order: [["userId", "DESC"]],
        })
          .then((response) => {
            result.recordsFiltered = response.count;
            result.data = response.rows;
            res.json(result);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
          });
      });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida",
      });
    }
  });
};
