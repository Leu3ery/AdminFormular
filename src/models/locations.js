module.exports = (sequelize, DataTypes) => {
    const Locations = sequelize.define(
        'Locations', 
        {
            address: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.STRING,
            },
            postcode: {
                type: DataTypes.STRING,
            },
            phone: {
                type: DataTypes.STRING,
            },
            mail: {
                type: DataTypes.STRING,
            }
        },
        {
            timestemps: false
        }
    )
    return Locations
}