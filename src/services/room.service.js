const {Rooms} = require('../models')
const utils = require('./utils')
const createError = require('http-errors')

async function createRoom(AdminId, data) {
    const {LocationId, GameId} = data
    const location = await utils.findLocation(LocationId)
    const game = await utils.findGame(GameId)
    const admin = await utils.findAdmin(AdminId)

    if ((!location.hasAdmin(admin) && admin.isSuperAdmin) || !location.hasGame(game)) {
        throw new createError(400, "Location has no this admin or game")
    }

    let code = utils.getRandomInt(1000, 10000)
    while(await Rooms.findOne({
        where: {
            isActivate: true,
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

async function getRoomInfo(adminId, roomId) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    return room
}

async function getRoomList(adminId, query) {
    //limit + offset + isActivate + locationId + adminId
    const admin = await utils.findAdmin(adminId)

    const request = {
        where: {}
    }

    if (query.limit) request.limit = query.limit
    if (query.offset) request.offset = query.offset
    if (query.isActivate != undefined) request.where.isActivate = query.isActivate
    if (query.locationId) request.where.LocationId = query.locationId
    if (query.adminId) request.where.AdminId = query.adminId

    const room = await Rooms.findAll(request)
    return room
}

async function updateRoom(adminId, roomId, value) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)


    if (!location.hasAdmin(admin) && admin.isSuperAdmin) {
        throw new createError(400, "Location has no this admin")
    }

    const updateData = {}
    if (value.gameId) {
        const game = await utils.findGame(value.gameId)
        if (!location.hasGame(game)) {
            throw new createError(400, "Location has no this game")
        }
        updateData.GameId = value.gameId
    }
    if (value.gameTime) updateData.gameTime = value.gameTime

    room.set(updateData)
    await room.save()
    return room
}

async function deleteRoom(adminId, roomId) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)

    if (!location.hasAdmin(admin) && admin.isSuperAdmin) {
        throw new createError(400, "Location has no this admin")
    }

    await room.destroy()
}

async function closeRoom(adminId, roomId) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)

    if (!location.hasAdmin(admin) && admin.isSuperAdmin) {
        throw new createError(400, "Location has no this admin")
    }

    room.isActivate = false
    room.code = null
    await room.save()
    return room
}

async function openRoom(adminId, roomId) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)

    if (!location.hasAdmin(admin) && admin.isSuperAdmin) {
        throw new createError(400, "Location has no this admin")
    }

    let code = utils.getRandomInt(1000, 10000)
    while(await Rooms.findOne({
        where: {
            isActivate: true,
            code
        }
    })) {
        code = utils.getRandomInt(1000, 10000)
    }

    room.isActivate = true
    room.code = code
    await room.save()
    return room
}

module.exports = {
    createRoom,
    getRoomInfo,
    getRoomList,
    updateRoom,
    deleteRoom,
    closeRoom,
    openRoom
}