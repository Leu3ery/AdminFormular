const ClientSchema = require('../validation/client.validation')
const ClientService = require('../services/client.service')
const utils = require('./utils')

async function createClient(req, res, next) {
    try {
        const inputData = JSON.parse(req.body.data)

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "file is required"
            })
        }
        inputData.photo = req.file.filename
        const value = utils.validationWrapper(ClientSchema.createClient, inputData)
        const data = await ClientService.createClient(value)
        utils.success(res, 201, {data})
    } catch (error) {
        next(error)
    }
}

async function getClientInfo(req, res, next) {
    try {
        const adminId = req.adminId
        const password = req.password
        const clientId = req.params.clientId
        const data = await ClientService.getClientInfo(adminId, password, clientId)
        utils.success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function updateClient(req, res, next) {
    try {
        const clientId = req.params.clientId
        const adminid = req.admin.id
        const inputData = req.body.data ? JSON.parse(req.body.data) : {}

        if (req.file) {
            inputData.photo = req.file.filename
        }

        const value = utils.validationWrapper(ClientSchema.updateClient, inputData)
        const data = await ClientService.updateClient(adminid, clientId, value)
        utils.success(res, 200, {data})
    } catch (error) {
        next(error)
    }
}

async function deleteClient(req, res, next) {
    try {
        const clientId = req.params.clientId
        const adminid = req.admin.id
        await ClientService.deleteClient(adminid, clientId)
        utils.success(res, 200)
    } catch (error) {
        next(error)
    }
}

// async function getClientsList(req, res, next) {
//     try {
        
//     } catch (error) {
//         next(error)
//     }
// }

module.exports = {
    createClient,
    getClientInfo,
    updateClient,
    deleteClient
}