const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const {Admins, Locations, AdminsLocations} = require('../models')
const utils = require('./utils')

async function createAdmin(value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    value.password = await bcrypt.hash(value.password, parseInt(config.PASSWORD_SALT))
    await Admins.create(value)
}

async function getJWT(value) {
    const user = await Admins.findOne({
        where: {
            username: value.username
        }
    })
    if (!user) {
        throw new createError(404, "Admin not found")
    }

    if (!await bcrypt.compare(value.password, user.password) ) {
        throw new createError(400, "Invalid password")
    }
    return jwt.sign({id: user.id}, config.JWT_SECRET_ADMIN, {expiresIn: 60 * 60 * 24 * 7})
}

async function getInfo(adminId) {
    const data = await Admins.findOne({
        attributes: ['firstName', 'lastName', 'username', 'isSuperAdmin'],
        where: {
            id: adminId
        }
    })
    if (!data) {
        throw new createError(404, "Admin not found")
    }
    return data
}

async function getInfoById(currentAdminId, adminId) {
    const currentAdmin = await Admins.findByPk(currentAdminId)
    if (!currentAdmin) {
        throw new createError(404, "Admin not found")
    }

    const data = await Admins.findOne({
        attributes: ['firstName', 'lastName', 'username', 'isSuperAdmin'],
        where: {
            id: adminId
        }
    })
    if (!data) {
        throw new createError(404, "Admin not found")
    }
    return data
}

async function getList(superadminId) {
    
    const admin = await Admins.findOne({
        where: {
            id: superadminId,
            isSuperAdmin: true
        }
    })

    if (!admin) {
        throw new createError(404, "Superadmin not found")
    }

    const data = await Admins.findAll({
        attributes: ['id', 'firstName', 'lastName', 'username', 'isSuperAdmin']
    })
    return data
}

async function updateAdmin(value, superadminId, adminId) {
    const superadmin = await Admins.findOne({
        where: {
            id: superadminId,
            isSuperAdmin: true
        }
    })
    if (!superadmin) {
        throw new createError(404, "Superadmin not found")
    }

    const admin = await Admins.findByPk(adminId)
    if (!admin) {
        throw new createError(404, "Admin not found")
    }

    if (value.password) {
        value.password = await bcrypt.hash(value.password, parseInt(config.PASSWORD_SALT))
    }

    admin.set(value)
    await admin.save()
}

async function deleteAdmin(superadminId, adminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    const admin = await Admins.findByPk(adminId) 
    if (!admin) {
        throw new createError(404, "Admin not found")
    }

    if (admin.username == superadmin.username) {
        throw new createError(400, "You cant delete yourself")
    }

    await admin.destroy()
}

async function connectLocationWithAdmin(adminId, locationId, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    const admin = await Admins.findByPk(adminId) 
    if (!admin) {
        throw new createError(404, "Admin not found")
    }

    const location = await Locations.findByPk(locationId)
    if (!location) {
        throw new createError(404, "Location not found")
    }

    await AdminsLocations.create({
        LocationId: locationId,
        AdminId: adminId
    })
}

async function getAdminLocations(adminId, currentAdminId) {
    const admin = await Admins.findByPk(adminId) 
    if (!admin) {
        throw new createError(404, "Admin not found")
    }

    const currentAdmin = await Admins.findByPk(currentAdminId) 
    if (!currentAdmin) {
        throw new createError(404, "currentAdmin not found")
    }

    return await admin.getLocations()
}

async function deleteAdminLocation(adminId, locationId) {
    const admin = await Admins.findByPk(adminId) 
    if (!admin) {
        throw new createError(404, "Admin not found")
    }

    const location = await Admins.findByPk(locationId) 
    if (!location) {
        throw new createError(404, "Location not found")
    }

    const association = await AdminsLocations.findOne({
        where: {
            adminId,
            locationId
        }
    })

    if (!association) {
        throw new createError(404, "There is not such association")
    }

    await association.destroy()
}

module.exports = {
    createAdmin,
    getJWT,
    getInfo,
    getInfoById,
    getList,
    updateAdmin,
    deleteAdmin,
    connectLocationWithAdmin,
    getAdminLocations,
    deleteAdminLocation
}