module.exports = (sequelize, DataTypes) => {
    const RoomsClients = sequelize.define(
        'RoomsClients',
        {
            clientSignature: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false
        }
    )
    return RoomsClients
}