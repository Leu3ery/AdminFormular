const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const {Admins} = require('../models')

async function createAdmin(value) {
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
    if (! await bcrypt.compare(value.password, user.password) ) {
        throw new createError(400, "Invalid password")
    }
    return jwt.sign({id: user.id}, config.JWT_SECRET, {expiresIn: 60})
}

module.exports = {
    createAdmin,
    getJWT
}