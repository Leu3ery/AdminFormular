const express = require('express')
const router = express.Router()
const upload = require('../multer/multer')
const ClientController = require('../controllers/client.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const getClientMiddleware = require('../middlewares/getClientMiddleware')

router.post('/', upload.single('file'), ClientController.createClient)
router.get('/', JWTAdminMiddleware, ClientController.getClientsList)
router.get('/:clientId', getClientMiddleware, ClientController.getClientInfo)
router.patch('/:clientId', upload.single('file'), JWTAdminMiddleware, ClientController.updateClient)
router.delete('/:clientId', JWTAdminMiddleware, ClientController.deleteClient)

module.exports = router