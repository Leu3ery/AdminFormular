const RoomValidation = require('../validation/room.validation')
const RoomService = require('../services/room.service')
const {success, validationWrapper} = require('./utils')

async function createRoom(req, res, next) {
    try {
        const adminId = req.admin.id
        const value = validationWrapper(RoomValidation.createRoomSchema, req.body)
        const data = await RoomService.createRoom(adminId, value)
        success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createRoom
}