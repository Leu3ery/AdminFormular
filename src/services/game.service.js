const {Games, Locations, Admins} = require('../models/')
const utils = require('./utils')
const createError = require('http-errors')
const fs = require('fs');
const path = require('path')

async function createGame(value, locationId, adminId) {
    const location = await utils.findLocation(locationId)
    const admin = await utils.findAdmin(adminId)

    if (await admin.hasLocation(location) || admin.isSuperAdmin) {
        return await Games.create(value)
    } else {
        throw new createError(400, "You have no premmision to do that")
    }
}

async function getGameListOnLocation(locationId) {
    const location = await utils.findLocation(locationId)

    return await location.getGames()
}

async function getGameInfoOnLocation(locationId, gameId) {
    const location = await utils.findLocation(locationId)
    const game = await utils.findGame(gameId)

    return game
}

async function deleteGameOnLocation(locationId, gameId, adminId) {
    const location = await utils.findLocation(locationId)
    const game = await utils.findGame(gameId)
    const admin = await utils.findAdmin(adminId)

    if ((location.hasGame(game) && location.hasAdmin(admin)) || admin.isSuperAdmin) {
        await game.destroy()
    } else {
        createError(400, "you has no premmision or this game dont belongs this locaion")
    }
} 

async function updateGameOnLocation(locationId, gameId, adminId, value) {
    const location = await utils.findLocation(locationId)
    const game = await utils.findGame(gameId)
    const admin = await utils.findAdmin(adminId)

    if ((location.hasGame(game) && location.hasAdmin(admin)) || admin.isSuperAdmin) {
        const iconPath = path.join(__dirname, '../public/', game.icon)
        if (value.icon && fs.existsSync(iconPath)) {
            fs.unlinkSync(iconPath)
        }
        game.set(value)
        await game.save()
        return game
    } else {
        createError(400, "you has no premmision or this game dont belongs this locaion")
    }
}

module.exports = {
    createGame,
    getGameListOnLocation,
    getGameInfoOnLocation,
    deleteGameOnLocation,
    updateGameOnLocation
}