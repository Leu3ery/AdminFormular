const {Games, Locations, Admins} = require('../models/')
const utils = require('./utils')
const createError = require('http-errors')

async function createGame(value, locationId, adminId) {
    const location = await Locations.findByPk(locationId)
    if (!location) {
        createError(404, "Location not found")
    }

    const admin = await Admins.findByPk(adminId)
    if (!admin) {
        createError(404, "Admin not found")
    }

    if (await admin.hasLocation(location) || admin.isSuperAdmin) {
        return await Games.create(value)
    } else {
        throw new createError(400, "You have no premmision to do that")
    }
}

module.exports = {
    createGame
}