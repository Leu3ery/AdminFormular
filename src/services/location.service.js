const createError = require('http-errors')
const utils = require('./utils')
const {Locations} = require('../models')

async function createLocation(value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    await Locations.create(value)
}

async function getLocationList() {
    const data = await Locations.findAll()
    return data
}

async function getLocationInfo(locationId) {
    const location = await utils.findLocation(locationId)

    return location
}

async function updateLocation(locationId, value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const location = await utils.findLocation(locationId)

    location.set(value)
    await location.save()
}

async function deleteLocation(locationId, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const location = await utils.findLocation(locationId)

    await location.destroy()
}

module.exports = {
    createLocation,
    getLocationList,
    getLocationInfo,
    updateLocation,
    deleteLocation
}