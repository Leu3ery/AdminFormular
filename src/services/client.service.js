const { _router } = require('../app')
const {Clients} = require('../models')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')

async function createClient(value) {
    const client = await Clients.create(value)
    return client
} 

async function getClientInfo(clientId) {
    const client = await utils.findClient(clientId)
    return client
}

async function updateClient(adminid, clientId, value) {
    const admin = await utils.findAdmin(adminid)
    const client = await utils.findClient(clientId)

    if (value.photo) {
        const photoPath = path.join(__dirname, "../public/", client.photo)
        if (fs.existsSync(photoPath))
        fs.unlinkSync(photoPath)
    }
    client.set(value)
    await client.save()
    return client
}

module.exports = {
    createClient,
    getClientInfo,
    updateClient
}