const express = require('express')
const router = express.Router()
const upload = require('../multer/multer')
const ClientController = require('../controllers/client.controller')
const JWTAdminMiddleware = require('../middlewares/JWTAdminMiddleware')
const getClientMiddleware = require('../middlewares/getClientMiddleware')
const createClientMiddleware = require('../middlewares/createClientMiddleware')

router.post('/', createClientMiddleware, upload.single('file'), ClientController.createClient)
router.get('/', JWTAdminMiddleware, ClientController.getClientsList)
router.get('/:clientId', getClientMiddleware, ClientController.getClientInfo)
router.patch('/:clientId', JWTAdminMiddleware, upload.single('file'), ClientController.updateClient)
router.delete('/:clientId', JWTAdminMiddleware, ClientController.deleteClient)

router.get('/:clientId/rooms', getClientMiddleware, ClientController.getListOfRoomsOfClient)

module.exports = router