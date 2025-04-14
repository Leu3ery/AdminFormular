const express = require('express')
const router = express.Router()

const LocationController = require('../controllers/location.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.post('/', JWTAdminMiddleware, LocationController.createLocation)
router.get('/list', LocationController.getLocationList)        
router.get('/:locationId', LocationController.getLocationInfo)  
router.put('/:locationId', JWTAdminMiddleware, LocationController.updateLocation) 
router.delete('/:locationId', JWTAdminMiddleware, LocationController.deleteLocation)                                                                                                                                                                                                                                                                                            

module.exports = router