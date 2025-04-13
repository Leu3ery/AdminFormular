module.exports = (sequelize, DataTypes) => {
    const AdminsLocations = sequelize.define(
        'AdminsLocations',
        {

        },
        {
            timestamps: false
        }
    )
    return AdminsLocations
}