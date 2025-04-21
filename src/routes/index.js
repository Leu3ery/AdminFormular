const express = require('express')
const router = express.Router()

router.use('/admins', require('./admin.route'))
router.use('/locations', require('./location.route'))
router.use('/rooms', require('./room.route'))
router.use('/clients', require('./client.route'))

module.exports = router