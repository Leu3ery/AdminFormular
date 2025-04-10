module.exports = (sequelize, DataTypes) => {
    const RoomsClientsAchievements = sequelize.define(
        'RoomsClientsAchievements',
        {
            
        },
        {
            timestamps: false
        }
    )
    return RoomsClientsAchievements
}