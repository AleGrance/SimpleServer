var CryptoJS = require("crypto-js");
module.exports = app => {
    const Users = app.db.models.Users;
    const htmlBody = `
  <div style="text-align: center;">
  <h1>ERROR 403</h1>
  <br>
  <img src="http://i.stack.imgur.com/SBv4T.gif" alt="I choose you!"  width="250" />
  <br>
  <h1>Forbidden</h1>
  </div>
  `;
    const apiToken = "35dd7b33-3c2a-48a4-827f-042e57c9c3b8";


    app.route('/api/users')
        .get((req, res) => {
            if (!req.headers.apitoken) {
                return res.status(403).send({
                    error: "Forbidden",
                    message: "Tu petición no tiene cabecera de autorización",
                });
            }

            if (req.headers.apitoken === apiToken) {
                Users.findAll()
                    .then(result => res.json(result))
                    .catch(error => {
                        res.status(402).json({
                            msg: error
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
            if (!req.headers.apitoken) {
                return res.status(403).send({
                    error: "Forbidden",
                    message: "Tu petición no tiene cabecera de autorización",
                });
            }

            if (req.headers.apitoken === apiToken) {
                // Receiving data
                const {
                    user_name,
                    user_password,
                    user_email,
                    user_fullname,
                    role_id
                } = req.body;
                // Creating new user
                const user = {
                    user_name: user_name,
                    user_password: user_password,
                    user_email: user_email,
                    user_fullname: user_fullname,
                    role_id: role_id,
                }
                // Encrypting password
                user.user_password = CryptoJS.AES.encrypt(user.user_password, 'secret').toString();
                // Insert new user
                Users.create(user)
                    .then(result => res.json({
                        msg: 'success',
                        body: result
                    }))
                    .catch(error => res.json({
                        msg: 'error',
                        body: error.errors
                    }));
            } else {
                return res.status(403).send({
                    error: "Forbidden",
                    message: "Cabecera de autorización inválida",
                });
            }
        });

    // app.route('/users/:user_id')
    //     .get((req, res) => {
    //         Users.findOne({
    //                 where: req.params
    //             })
    //             .then(result => res.json(result))
    //             .catch(error => {
    //                 res.status(404).json({
    //                     msg: error.message
    //                 });
    //             });
    //     })
    //     .put((req, res) => {
    //         Users.update(req.body, {
    //                 where: req.params
    //             })
    //             .then(result => res.sendStatus(204))
    //             .catch(error => {
    //                 res.status(412).json({
    //                     msg: error.message
    //                 });
    //             })
    //     })
    //     .delete((req, res) => {
    //         //const id = req.params.id;
    //         Users.destroy({
    //                 where: req.params
    //             })
    //             .then(() => res.json(req.params))
    //             .catch(error => {
    //                 res.status(412).json({
    //                     msg: error.message
    //                 });
    //             })
    //     })

};