module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define(
        'Rooms',
        {
            gameTime: {
                type: DataTypes.INTEGER
            }
        },
    )
    return Rooms
}