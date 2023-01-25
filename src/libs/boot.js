import https from 'https';
import fs from 'fs';
import path from 'path';

module.exports = app => {

    //metodo sync que crea las tablas
    app.db.sequelize.sync()
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log('Server on port', app.get('port'));
        });
        /*https.createServer({
            key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
        }, app).listen(app.get('port'), () => {
            console.log('Server on port', app.get('port'));
        });*/
    });

};