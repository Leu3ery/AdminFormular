const express = require('express')
const router = express.Router()

const upload = require('../multer/multer');

const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const RoomController = require('../controllers/room.controller')
const ClientController = require('../controllers/client.controller')
const getClientMiddleware = require('../middlewares/getClientMiddleware')

router.post('/', JWTAdminMiddleware, RoomController.createRoom)
router.get('/code/:code', RoomController.isRoomOpen)
router.get('/:roomId', JWTAdminMiddleware, RoomController.getRoomInfo)
router.patch('/:roomId', JWTAdminMiddleware, RoomController.updateRoom) // locatoinId gameId gameTime
router.delete('/:roomId', JWTAdminMiddleware, RoomController.deleteRoom)
router.patch('/:roomId/open', JWTAdminMiddleware, RoomController.openRoom)
router.patch('/:roomId/close', JWTAdminMiddleware, RoomController.closeRoom)

router.post('/:roomId/clients/:clientId', getClientMiddleware, upload.single('file'), ClientController.connectClientWithRoom) // only for admin or you need to send password
router.delete('/:roomId/clients/:clientId', JWTAdminMiddleware, ClientController.deleteClientFromRoom) // only for admin
router.get('/:roomId/clients', JWTAdminMiddleware, ClientController.getListOfClients) // only for admin


module.exports = router