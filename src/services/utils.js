const {Admins, Locations, Games} = require('../models')
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
    const location = await Locations.findByPk(locationId)
    if (!location) {
        throw createError(404, "Location not found")
    } else {
        return location
    }
}

async function findGame(gameId) {
    const game = await Games.findByPk(gameId)
    if (!game) {
        throw createError(404, "Game not found")
    } else {
        return game
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

module.exports = {
    isSuperAdmin,
    findAdmin,
    findLocation,
    findGame,
    getRandomInt
}
