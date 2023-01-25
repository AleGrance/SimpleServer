module.exports = app => {
    const Tasks = app.db.models.Tasks;
    const Users = app.db.models.Users;

    app.route('/tasks')
        .get((req, res) => {
            Tasks.findAll({
                order: [['createdAt', 'DESC']]
            })
                .then(result => res.json(result))
                .catch(error => {
                    res.status(402).json({
                        msg: error.menssage
                    });
                });
        })
        .post((req, res) => {
            console.log(req.body);
            Tasks.create(req.body)
                .then(result => res.json(result))
                .catch(error => res.json(error.errors));
        })

    app.route('/tasks/:task_id')
        .get((req, res) => {
            Tasks.findOne({
                    where: req.params,
                    include: [{
                        model: Users
                    }]
                })
                .then(result => res.json(result))
                .catch(error => {
                    res.status(404).json({
                        msg: error.message
                    });
                });
        })
        .put((req, res) => {
            Tasks.update(req.body, {
                    where: req.params
                })
                .then(result => res.sendStatus(204))
                .catch(error => {
                    res.status(412).json({
                        msg: error.message
                    });
                })
        })
        .delete((req, res) => {
            //const id = req.params.id;
            Tasks.destroy({
                    where: req.params
                })
                .then(() => res.json(req.params))
                .catch(error => {
                    res.status(412).json({
                        msg: error.message
                    });
                })
        })
};