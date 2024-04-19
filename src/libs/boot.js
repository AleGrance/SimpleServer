import moment from "moment";
let hoyAhora = moment().format("HH:mm");

module.exports = (app) => {
  //metodo sync que crea las tablas
  app.db.sequelize.sync().then(() => {
    app.listen(app.get("port"), () => {
      console.log("Server on port", app.get("port"));
      console.log("Simple API iniciado a las:", hoyAhora);
    });
  });
};
