const express = require('express')
const router = express.Router()

const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const RoomController = require('../controllers/room.controller')

router.post('/', JWTAdminMiddleware, RoomController.createRoom)
router.get('/', JWTAdminMiddleware, RoomController.getRoomList)  //limit + offset + isActivate + locationId + adminId
router.get('/code/:code', RoomController.isRoomOpen)
router.get('/:roomId', JWTAdminMiddleware, RoomController.getRoomInfo)
router.patch('/:roomId', JWTAdminMiddleware, RoomController.updateRoom) // locatoinId gameId gameTime
router.delete('/:roomId', JWTAdminMiddleware, RoomController.deleteRoom)
router.patch('/:roomId/open', JWTAdminMiddleware, RoomController.openRoom)
router.patch('/:roomId/close', JWTAdminMiddleware, RoomController.closeRoom)


module.exports = router