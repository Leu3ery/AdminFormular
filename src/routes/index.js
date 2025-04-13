const express = require('express')
const router = express.Router()

router.use('/admin', require('./admin.route'))
router.use('/location', require('./location.route'))

module.exports = router