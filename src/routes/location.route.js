const express = require('express')
const router = express.Router()

const LocationController = require('../controllers/location.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.post('/', JWTAdminMiddleware, LocationController.createLocation)
router.get('/list', JWTAdminMiddleware, LocationController.getList)                                                                                                                                                                                                                                                                                                     

module.exports = router