const {Games, Locations, Admins} = require('../models/')
const utils = require('./utils')
const createError = require('http-errors')

async function createGame(value, locationId, adminId) {
    const location = await utils.findLocation(locationId)
    const admin = await utils.findAdmin(adminId)

    if (await admin.hasLocation(location) || admin.isSuperAdmin) {
        return await Games.create(value)
    } else {
        throw new createError(400, "You have no premmision to do that")
    }
}

async function getGameListOnLocation(locationId, adminId) {
    
}

module.exports = {
    createGame
}