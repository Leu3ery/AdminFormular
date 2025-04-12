const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')
const JWTMiddleware = require('../middlewares/JWTMiddleware')

router.post('/register', JWTMiddleware, AdminController.createAdmin)
router.post('/login', AdminController.getJWT)

module.exports = router