const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')

router.get('/', JWTAdminMiddleware, AdminController.getInfo)
router.post('/register', JWTAdminMiddleware, AdminController.createAdmin)
router.post('/login', AdminController.getJWT)
router.get('/list', JWTAdminMiddleware, AdminController.getList)
router.get('/:adminId', JWTAdminMiddleware, AdminController.getInfoById)
router.put('/:adminId', JWTAdminMiddleware, AdminController.updateAdmin)
router.delete('/adminId', JWTAdminMiddleware, AdminController.deleteAdmin)


module.exports = router