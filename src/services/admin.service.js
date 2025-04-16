const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const {Admins, Locations, AdminsLocations} = require('../models')
const utils = require('./utils')

async function createAdmin(value, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    value.password = await bcrypt.hash(value.password, parseInt(config.PASSWORD_SALT))
    const admin = await Admins.create(value)
    return await Admins.findByPk(admin.id, { attributes: { exclude: ['password'] } })
}

async function getAdminJWT(value) {
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

async function getAdminInfo(adminId) {
    const data = await Admins.findOne({
        attributes: ['id', 'firstName', 'lastName', 'username', 'isSuperAdmin'],
        where: {
            id: adminId
        }
    })
    if (!data) {
        throw new createError(404, "Admin not found")
    }
    return data
}

async function getAdminInfoById(currentAdminId, adminId) {
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

async function getAdminList(superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)

    const data = await Admins.findAll({
        attributes: ['id', 'firstName', 'lastName', 'username', 'isSuperAdmin']
    })
    return data
}

async function updateAdmin(value, superadminId, adminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const admin = await utils.findAdmin(adminId)

    if (value.password) {
        value.password = await bcrypt.hash(value.password, parseInt(config.PASSWORD_SALT))
    }

    admin.set(value)
    await admin.save()
    return await Admins.findByPk(adminId, { attributes: { exclude: ['password'] } });
}

async function deleteAdmin(superadminId, adminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const admin = await utils.findAdmin(adminId)

    if (admin.username == superadmin.username) {
        throw new createError(400, "You cant delete yourself")
    }

    await admin.destroy()
}

async function connectLocationWithAdmin(adminId, locationId, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const admin = await utils.findAdmin(adminId)
    const location = await utils.findLocation(locationId)

    await AdminsLocations.create({
        LocationId: locationId,
        AdminId: adminId
    })
}

async function getAdminLocations(adminId, locationsFromAdminId) {
    const superadmin = await utils.isSuperAdmin(adminId)
    const admin = await utils.findAdmin(locationsFromAdminId)

    return await admin.getLocations()
}

async function getMyLocations(adminId) {
    const admin = await utils.findAdmin(adminId)
    
    return await admin.getLocations()
}

async function deleteAdminLocation(adminId, locationId, superadminId) {
    const superadmin = await utils.isSuperAdmin(superadminId)
    const admin = await utils.findAdmin(adminId)
    const location = await utils.findLocation(locationId)

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
    getAdminJWT,
    getAdminInfo,
    getAdminInfoById,
    getAdminList,
    updateAdmin,
    deleteAdmin,
    connectLocationWithAdmin,
    getAdminLocations,
    getMyLocations,
    deleteAdminLocation
}