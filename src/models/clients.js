module.exports = (sequelize, DataTypes) => {
    const Clients = sequelize.define(
        'Clients',
        {
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            birthday: {
                type: DataTypes.DATE
            },
            phone: {
                type: DataTypes.STRING
            },
            mail: {
                type: DataTypes.STRING
            },
            photo: {
                type: DataTypes.STRING
            }
        }
    )
    return Clients
}