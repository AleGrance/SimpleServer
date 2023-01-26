module.exports = (sequelize, DataType) => {

    const Users = sequelize.define('Users', {
        user_id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        user_fullname: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        user_password: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        user_email: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                msg: 'El correo ingresado ya existe',
                fields: ['user_email']
            },
            validate: {
                notEmpty: {
                    msg: 'El correo no debe estar vacio!',
                    fields: ['user_email']
                }
            }
        }
    });

    Users.associate = (models) => {
        Users.hasMany(models.Tasks);
    };

    Users.associate = (models) => {
        Users.belongsTo(models.Roles, {
            foreignKey: {
                name: 'role_id',
                allowNull: false
            }
        });
    };

    return Users;
};