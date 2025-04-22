const {Clients, Rooms} = require('../models')
const { Op } = require("sequelize");
const utils = require('./utils')
const fs = require('fs')
const path = require('path')
const createError = require('http-errors')

async function createClient(value, code, adminId) {
    if (adminId) {
        const admin = await utils.findAdmin(adminId)
    } else {
        const room = await Rooms.findOne({
            where: {
                code: code
            }
        })
    
        if (!room) {
            throw createError(404, "Room  was not found")
        }
    }

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let password = ""
    for (let i=0;i<8;i++) {
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
        const clientExist = await Clients.findOne({
            where: {
                id: clientId,
                password: password
            }
        })
        if (!clientExist) {
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

    if (client.photo) {
        const photoPath = path.join(__dirname, "../public/", client.photo)
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath)
    }

    await client.destroy()
}

async function getClientsList(adminId, query) {
    const admin = await utils.findAdmin(adminId)
    
    const request = {
        where: {}
    }

    if (query.limit) request.limit = query.limit
    if (query.offset) request.offset = query.offset
    if (query.id) request.where.id = query.id
    if (query.phone) request.where.phone = {[Op.startsWith]:query.phone}
    if (query.firstName) request.where.firstName = {[Op.startsWith]:query.firstName}
    if (query.lastName) request.where.lastName = {[Op.startsWith]:query.lastName}

    const clients = await Clients.findAll(request)
    return clients
}

module.exports = {
    createClient,
    getClientInfo,
    updateClient,
    deleteClient,
    getClientsList
}