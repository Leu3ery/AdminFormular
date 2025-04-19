const express = require('express')
const router = express.Router()

router.use('/admin', require('./admin.route'))
router.use('/location', require('./location.route'))
router.use('/room', require('./room.route'))
router.use('/clients', require('./client.route'))

module.exports = router