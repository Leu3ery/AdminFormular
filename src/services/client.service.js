const {Clients} = require('../models')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')
const createError = require('http-errors')

async function createClient(value) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let password = ""
    for (i=0;i<8;i++) {
        password += chars[utils.getRandomInt(0, chars.length)]
    }
    value.password = password
    const client = await Clients.create(value)
    return client
} 

async function getClientInfo(adminId, password, clientId) {
    if (adminId) {
        const admin = await utils.findAdmin(adminId)
    } else {
        const client = await Clients.findOne({
            where: {
                id: clientId,
                password: password
            }
        })
        if (!client) {
            throw createError(404, "Username of password are false")
        }
    }
    const client = await utils.findClient(clientId)
    return client
}

async function updateClient(adminid, clientId, value) {
    const admin = await utils.findAdmin(adminid)
    const client = await utils.findClient(clientId)

    if (value.photo) {
        const photoPath = path.join(__dirname, "../public/", client.photo)
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath)
    }
    client.set(value)
    await client.save()
    return client
}

async function deleteClient(adminid, clientId) {
    const admin = await utils.findAdmin(adminid)
    const client = await utils.findClient(clientId)

    const photoPath = path.join(__dirname, "../public/", client.photo)
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath)

    await client.destroy()
}

module.exports = {
    createClient,
    getClientInfo,
    updateClient,
    deleteClient
}