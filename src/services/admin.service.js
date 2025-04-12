const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const {Admins} = require('../models')

async function createAdmin(value, adminId) {
    const admin = await Admins.findOne({
        where: {
            id: adminId,
            isSuperAdmin: true
        }
    })

    if (!admin) {
        throw new createError(404, "Superadmin not found")
    }

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
        throw new createError(404, "User not found")
    }

    if (!await bcrypt.compare(value.password, user.password) ) {
        throw new createError(400, "Invalid password")
    }
    return jwt.sign({id: user.id}, config.JWT_SECRET, {expiresIn: 60 * 60 * 24 * 7})
}

module.exports = {
    createAdmin,
    getJWT
}