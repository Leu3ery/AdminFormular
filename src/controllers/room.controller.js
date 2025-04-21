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
        const locationId = req.params.locationId
        const adminId = req.admin.id
        const query = validationWrapper(RoomValidation.getRoomList, req.query)
        const data = await RoomService.getRoomList(adminId, locationId, query)
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

async function deleteRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const roomId = req.params.roomId
        await RoomService.deleteRoom(adminId, roomId)
        success(res, 200)
    } catch (error) {
        next(error)
    }
}

async function closeRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const roomId = req.params.roomId
        const data = await RoomService.closeRoom(adminId, roomId)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function openRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const roomId = req.params.roomId
        const data = await RoomService.openRoom(adminId, roomId)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function isRoomOpen(req, res, next) {
    try {
        const code = req.params.code
        const data = await RoomService.isRoomOpen(code)
        success(res, 200, {isRoomOpen:data ? true : false})
    } catch (error) {
        
    }
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