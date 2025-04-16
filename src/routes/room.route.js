const express = require('express')
const router = express.Router()

const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const RoomController = require('../controllers/room.controller')

router.post('/', JWTAdminMiddleware, RoomController.createRoom)

module.exports = router