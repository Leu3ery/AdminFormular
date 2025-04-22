const {Rooms} = require('../models')
const utils = require('./utils')
const createError = require('http-errors')

async function createRoom(AdminId, data) {
    const {LocationId, GameId} = data
    const location = await utils.findLocation(LocationId)
    const game = await utils.findGame(GameId)
    const admin = await utils.findAdmin(AdminId)

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    const ownsGame = await location.hasGame(game);

    if ((!isAdminOfLocation && !isSuper) || !ownsGame) {
    throw createError(403, "You have no permission or this game doesn’t belong to this location");
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
    const location = await utils.findLocation(room.LocationId)

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;

    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission or this game doesn’t belong to this location");
    }

    return room
}

async function getRoomList(adminId, locationId, query) {
    //limit + offset + isActivate + adminId
    const admin = await utils.findAdmin(adminId)
    const location = await utils.findLocation(locationId)

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission");
    }

    const request = {
        where: {
            LocationId:locationId
        }
    }

    if (query.limit) request.limit = query.limit
    if (query.offset) request.offset = query.offset
    if (query.isActivate != undefined) request.where.isActivate = query.isActivate
    if (query.adminId) request.where.AdminId = query.adminId

    const room = await Rooms.findAll(request)
    return room
}

async function updateRoom(adminId, roomId, value) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)


    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission");
    }

    const updateData = {}
    if (value.gameId) {
        const game = await utils.findGame(value.gameId)
        if (!await location.hasGame(game)) {
            throw createError(400, "Location has no this game")
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

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission");
    }

    await room.destroy()
}

async function closeRoom(adminId, roomId) {
    const admin = await utils.findAdmin(adminId)
    const room = await utils.findRoom(roomId)
    const location = await utils.findLocation(room.LocationId)

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission");
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

    const isAdminOfLocation = await location.hasAdmin(admin);
    const isSuper = admin.isSuperAdmin;
    if (!isAdminOfLocation && !isSuper) {
        throw createError(403, "You have no permission");
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

async function isRoomOpen(code) {
    const room = await Rooms.findOne({
        where: {
            isActivate: true,
            code
        }
    })
    return room
}

module.exports = {
    createRoom,
    getRoomInfo,
    getRoomList,
    updateRoom,
    deleteRoom,
    closeRoom,
    openRoom,
    isRoomOpen
}