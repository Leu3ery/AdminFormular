const express = require('express')
const router = express.Router()

const AdminController = require('../controllers/admin.controller')

router.post('/register', AdminController.createAdmin)
router.post('/login', AdminController.getJWT)

module.exports = router