const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage:'database.sqlite',
    define: {
        freezeTableName: true
    }
})

const Admins = require('./admins')(sequelize, DataTypes)
const Locations = require('./locations')(sequelize, DataTypes)
const Games = require('./games')(sequelize, DataTypes)
const Clients = require('./clients')(sequelize, DataTypes)
const Rooms = require('./rooms')(sequelize, DataTypes)
const RoomsClients = require('./RoomsClients')(sequelize, DataTypes)
const AdminsLocations = require('./AdminsLocations')(sequelize, DataTypes)

Admins.belongsToMany(Locations, {through: AdminsLocations})
Locations.belongsToMany(Admins, {through: AdminsLocations})

Locations.hasMany(Games)
Games.belongsTo(Locations)

Admins.hasOne(Rooms)
Rooms.belongsTo(Admins)
Games.hasOne(Rooms)
Rooms.belongsTo(Games)


Clients.belongsToMany(Rooms, {through: RoomsClients})
Rooms.belongsToMany(Clients, {through: RoomsClients})

module.exports = {
    sequelize,
    Admins,
    Locations,
    Games,
    Clients,
    Rooms,
    RoomsClients,
    AdminsLocations
}