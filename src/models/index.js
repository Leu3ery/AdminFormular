const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'database.sqlite',
    define: {
        freezeTableName: true
    }
})

const Admins = require('./admins')(sequelize, DataTypes)
const Locations = require('./locations')(sequelize, DataTypes)
const Games = require('./games')(sequelize, DataTypes)
const Clients = require('./clients')(sequelize, DataTypes)
const Achievements = require('./achievements')(sequelize, DataTypes)
const Rooms = require('./rooms')(sequelize, DataTypes)
const RoomsClientsAchievements = require('./RoomsClientsAchievements')(sequelize, DataTypes)

Admins.belongsToMany(Locations, {through: 'AdminsLocations'})
Locations.belongsToMany(Admins, {through: 'AdminsLocations'})

Locations.hasMany(Games)
Games.belongsTo(Locations)

Locations.hasMany(Achievements)
Achievements.belongsTo(Locations)

Admins.hasOne(Rooms)
Rooms.belongsTo(Admins)
Locations.hasOne(Rooms)
Rooms.belongsTo(Locations)
Games.hasOne(Rooms)
Rooms.belongsTo(Games)


Clients.belongsToMany(Rooms, {through: RoomsClientsAchievements})
Rooms.belongsToMany(Clients, {through: RoomsClientsAchievements})
Achievements.hasMany(RoomsClientsAchievements)
RoomsClientsAchievements.belongsTo(Achievements)

module.exports = {
    sequelize,
    Admins,
    Locations,
    Games,
    Clients,
    Achievements,
    Rooms,
    RoomsClientsAchievements
}