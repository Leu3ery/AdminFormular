const createError = require('http-errors')
const utils = require('./utils')
const {Locations, Admins} = require('../models')

async function createLocation(value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    await Locations.create(value)
}

async function getList(superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const data = await Locations.findAll()
    return data
}



module.exports = {
    createLocation,
    getList
}