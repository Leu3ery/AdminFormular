const {Admins} = require('../models/index')
const config = require('./config')
const bcrypt = require('bcryptjs')

module.exports = async () => {
    const admin = await Admins.findOne({
        where: {
            username:JSON.parse(config.SUPERADMIN_DATA).username
        }
    })
    const adminData = JSON.parse(config.SUPERADMIN_DATA)
    if (!admin) {
        await Admins.create(adminData)
    } else {
        admin.set(adminData)
        await admin.save()
    }
}