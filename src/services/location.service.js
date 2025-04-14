const createError = require('http-errors')
const utils = require('./utils')
const {Locations, Admins} = require('../models')

async function createLocation(value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    await Locations.create(value)
}

async function getList() {
    const data = await Locations.findAll()
    return data
}

async function getInfo(locationId) {
    const location = await Locations.findByPk(locationId)

    if (!location) {
        throw new createError(404, "Location not found")
    }

    return location
}

async function updateLocation(locationId, value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const location = await Locations.findByPk(locationId)

    if (!location) {
        throw new createError(404, "Location not found")
    }

    location.set(value)
    await location.save()
}

async function deleteLocation(locationId, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    const location = await Locations.findByPk(locationId)

    if (!location) {
        throw new createError(404, "Location not found")
    }

    await location.destroy()
}

module.exports = {
    createLocation,
    getList,
    getInfo,
    updateLocation,
    deleteLocation
}