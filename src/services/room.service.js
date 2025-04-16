const {Rooms} = require('../models')
const utils = require('./utils')
const createError = require('http-errors')

async function createRoom(AdminId, data) {
    const {LocationId, GameId} = data
    const location = await utils.findLocation(LocationId)
    const game = await utils.findGame(GameId)
    const admin = await utils.findAdmin(AdminId)

    if (!location.hasAdmin(admin) || !location.hasGame(game)) {
        throw new createError(400, "Location has no this admin or game")
    }

    let code = utils.getRandomInt(1000, 10000)
    while(await Rooms.findOne({
        where: {
            code
        }
    })) {
        code = utils.getRandomInt(1000, 10000)
    }
    
    const room = await Rooms.create({
        AdminId,
        LocationId,
        GameId,
        code
    })

    return room
}

module.exports = {
    createRoom
}