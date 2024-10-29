module.exports = (sequelize, DataType) => {

    const Roles = sequelize.define('Roles', {
        roleId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                arg: true,
                msg: 'El nombre ingresado ya existe'
            },
        }
    });

    Roles.associate = (models) => {
        Roles.hasMany(models.Users, {
            foreignKey: {
                name: 'roleId',
                allowNull: false
            }
        });
    };

    return Roles;
};