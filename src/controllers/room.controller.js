const RoomValidation = require('../validation/room.validation')
const RoomService = require('../services/room.service')
const {success, validationWrapper} = require('./utils')

async function createRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const value = validationWrapper(RoomValidation.createRoomSchema, req.body)
        const data = await RoomService.createRoom(adminId, value)
        success(res, 201, {data})
    } catch (error) {
        next(error)
    }
}

async function getRoomInfo(req, res, next) {
    try {
        const adminId = req.admin.id
        const roomId = req.params.roomId
        const data = await RoomService.getRoomInfo(adminId, roomId)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function getRoomList(req, res, next) {
    try {
        //limit + offset + isActivate + locationId + adminId
        const adminId = req.admin.id
        const query = validationWrapper(RoomValidation.getRoomList, req.query)
        const data = await RoomService.getRoomList(adminId, query)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function updateRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const roomId = req.params.roomId
        const value = validationWrapper(RoomValidation.updateRoom, req.body)
        const data = await RoomService.updateRoom(adminId, roomId, value)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createRoom,
    getRoomInfo,
    getRoomList,
    updateRoom
}