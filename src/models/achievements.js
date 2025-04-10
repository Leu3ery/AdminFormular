module.exports = (sequelize, DataTypes) => {
    const Achievements = sequelize.define(
        'Achievements',
        {
            name: {
                type: DataTypes.STRING
            },
            icon: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false
        }
    )
    return Achievements
}