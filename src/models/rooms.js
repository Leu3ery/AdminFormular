module.exports = (sequelize, DataTypes) => {
    const Rooms = sequelize.define(
        'Rooms',
        {
            gameTime: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            isActivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }, 
            code: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true
            }
        },
    )
    return Rooms
}