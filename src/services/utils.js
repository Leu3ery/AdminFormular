const {Admins} = require('../models')
const createError = require('http-errors')

async function isSuperAdmin(superadminId) {
    const superadmin = await Admins.findOne({
        where: {
            id: superadminId,
            isSuperAdmin: true
        }
    })

    if (!superadmin) {
        throw createError(404, "Superadmin not found")
    } else {
        return superadmin
    }
}

async function findAdmin(adminId) {
    const admin = await Admins.findByPk(adminId)
    if (!admin) {
        throw createError(404, "Admin not found")
    } else {
        return admin
    }
}

async function findLocation(locationId) {
    const location = await Admins.findByPk(locationId)
    if (!location) {
        throw createError(404, "Location not found")
    } else {
        return location
    }
}

module.exports = {
    isSuperAdmin,
    findAdmin,
    findLocation
}
