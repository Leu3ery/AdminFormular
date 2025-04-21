const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.get('/me', JWTAdminMiddleware, AdminController.getAdminInfo) // / -> /me
router.post('/register', JWTAdminMiddleware, AdminController.createAdmin)
router.post('/login', AdminController.getAdminJWT)
router.get('/', JWTAdminMiddleware, AdminController.getAdminList) // /list -> /
router.get('/locations', JWTAdminMiddleware, AdminController.getMyLocations)//s
router.get('/:adminId', JWTAdminMiddleware, AdminController.getAdminInfoById)
router.patch('/:adminId', JWTAdminMiddleware, AdminController.updateAdmin)
router.delete('/:adminId', JWTAdminMiddleware, AdminController.deleteAdmin)

router.get('/:adminId/locations', JWTAdminMiddleware, AdminController.getAdminLocations) //s
router.post('/:adminId/locations/:locationId', JWTAdminMiddleware, AdminController.connectLocationWithAdmin)//s
router.delete('/:adminId/locations/:locationId', JWTAdminMiddleware, AdminController.deleteAdminLocation)//s

module.exports = router