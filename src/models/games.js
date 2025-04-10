module.exports = (sequelize, DataTypes) => {
    const Games = sequelize.define(
        'Games',
        {
            name: {
                type: DataTypes.STRING,
            },
            icon: {
                type: DataTypes.STRING,
            },
            color: {
                type: DataTypes.STRING,
            },
            maxPlayers: {
                type: DataTypes.INTEGER,
            }
        },
        {
            timestamps: false
        }
    )
    return Games
}