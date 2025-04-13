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

module.exports = {
    isSuperAdmin
}
