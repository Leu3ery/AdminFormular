const express = require('express')
const router = express.Router()

const upload = require('../multer/multer');

const LocationController = require('../controllers/location.controller')
const GameController = require('../controllers/game.controller')
const RoomController = require('../controllers/room.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.post('/', JWTAdminMiddleware, LocationController.createLocation)
router.get('/', LocationController.getLocationList)       // /list -> / 
router.get('/:locationId', LocationController.getLocationInfo)  
router.patch('/:locationId', JWTAdminMiddleware, LocationController.updateLocation) 
router.delete('/:locationId', JWTAdminMiddleware, LocationController.deleteLocation)

router.get('/:locationId/rooms', JWTAdminMiddleware, RoomController.getRoomList) //limit + offset + isActivate + locationId + adminId

router.post('/:locationId/games', JWTAdminMiddleware, upload.single('file'), GameController.createGameOnLocation)
router.get('/:locationId/games', GameController.getGameListOnLocation)
router.get('/:locationId/games/:gameId', GameController.getGameInfoOnLocation)
router.patch('/:locationId/games/:gameId', JWTAdminMiddleware, upload.single('file'), GameController.updateGameOnLocation)
router.delete('/:locationId/games/:gameId', JWTAdminMiddleware, GameController.deleteGameOnLocation)

module.exports = router