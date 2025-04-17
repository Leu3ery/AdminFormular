const express = require('express')
const router = express.Router()

const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const RoomController = require('../controllers/room.controller')

router.post('/', JWTAdminMiddleware, RoomController.createRoom)

// router.put('/', JWTAdminMiddleware, RoomController.updateRoom) // locatoinId gameId gameTime
// router.post('/open', JWTAdminMiddleware, RoomController.openRoom)
// router.post('/close', JWTAdminMiddleware, RoomController.closeRoom)


module.exports = router