const express = require('express')
const router = express.Router()

const upload = require('../multer/multer');

const LocationController = require('../controllers/location.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.post('/', JWTAdminMiddleware, LocationController.createLocation)
router.get('/', LocationController.getLocationList)       // /list -> / 
router.get('/:locationId', LocationController.getLocationInfo)  
router.patch('/:locationId', JWTAdminMiddleware, LocationController.updateLocation) 
router.delete('/:locationId', JWTAdminMiddleware, LocationController.deleteLocation)

router.post('/:locationId/games', JWTAdminMiddleware, upload.single('file'), LocationController.createGameOnLocation)
router.get('/:locationId/games', LocationController.getGameListOnLocation)
router.get('/:locationId/games/:gameId', LocationController.getGameInfoOnLocation)
router.patch('/:locationId/games/:gameId', JWTAdminMiddleware, upload.single('file'), LocationController.updateGameOnLocation)
router.delete('/:locationId/games/:gameId', JWTAdminMiddleware, LocationController.deleteGameOnLocation)

module.exports = router