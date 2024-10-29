module.exports = (sequelize, DataType) => {

    const Users = sequelize.define('Users', {
        userId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userName: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                arg: true,
                msg: 'El user_name ingresado ya existe!',
                fields: ['user_name']
            },
            validate: {
                notEmpty: {
                    msg: 'El nombre de usuario no debe estar vacio!',
                    fields: ['user_name']
                }
            }
        },
        userFullname: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre full de usuario no debe estar vacio!',
                    fields: ['user_fullname']
                }
            }
        },
        userPassword: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La no contraseña no debe estar vacia!',
                    fields: ['user_password']
                }
            }
        },
        userEmail: {
            type: DataType.STRING,
            allowNull: false,
            unique: {
                msg: 'El correo ingresado ya existe',
            },
            validate: {
                isEmail: {
                    msg: 'El correo ingresado no es valido'
                },
                notEmpty: {
                    msg: 'El correo no debe estar vacio!',
                    fields: ['user_email']
                }
            }
        }
    });

    // Respetar el orden
    // Primero los hasMany
    // Users.associate = (models) => {
    //     Users.hasMany(models.Tasks);
    // };

    // Segundo los belongsTo
    Users.associate = (models) => {
        Users.belongsTo(models.Roles, {
            foreignKey: {
                name: 'roleId',
                allowNull: false
            }
        });
    };

    return Users;
};