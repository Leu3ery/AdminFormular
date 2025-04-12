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
    adminData.password = await bcrypt.hash(adminData.password, parseInt(config.PASSWORD_SALT))
    if (!admin) {
        await Admins.create(adminData)
    } else {
        admin.set(adminData)
        await admin.save()
    }
}