const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.get('/', JWTAdminMiddleware, AdminController.getAdminInfo)
router.post('/register', JWTAdminMiddleware, AdminController.createAdmin)
router.post('/login', AdminController.getAdminJWT)
router.get('/list', JWTAdminMiddleware, AdminController.getAdminList)
router.get('/location', JWTAdminMiddleware, AdminController.getMyLocations)
router.get('/:adminId', JWTAdminMiddleware, AdminController.getAdminInfoById)
router.patch('/:adminId', JWTAdminMiddleware, AdminController.updateAdmin)
router.delete('/:adminId', JWTAdminMiddleware, AdminController.deleteAdmin)

router.get('/:adminId/location', JWTAdminMiddleware, AdminController.getAdminLocations)
router.post('/:adminId/location/:locationId', JWTAdminMiddleware, AdminController.connectLocationWithAdmin)
router.delete('/:adminId/location/:locationId', JWTAdminMiddleware, AdminController.deleteAdminLocation)

module.exports = router