module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define(
        'Rooms',
        {
            gameTime: {
                type: DataTypes.INTEGER
            },
            isActivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }, 
            code: {
                type: DataTypes.INTEGER,
            }
        },
    )
    return Rooms
}