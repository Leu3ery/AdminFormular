const express = require('express')
const router = express.Router()

const upload = require('../multer/multer');

const LocationController = require('../controllers/location.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.post('/', JWTAdminMiddleware, LocationController.createLocation)
router.get('/list', LocationController.getLocationList)        
router.get('/:locationId', LocationController.getLocationInfo)  
router.put('/:locationId', JWTAdminMiddleware, LocationController.updateLocation) 
router.delete('/:locationId', JWTAdminMiddleware, LocationController.deleteLocation)

router.post('/:locationId/game', JWTAdminMiddleware, upload.single('file'), LocationController.createGameOnLocation)
router.get('/:locationId/game', LocationController.getGameListOnLocation)
router.get('/:locationId/game/:gameId', LocationController.getGameInfoOnLocation)
router.put('/:locationId/game/:gameId', JWTAdminMiddleware, upload.single('file'), LocationController.updateGameOnLocation)
router.delete('/:locationId/game/:gameId', JWTAdminMiddleware, LocationController.deleteGameOnLocation)

module.exports = router