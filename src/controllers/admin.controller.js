const AdminSchema = require('../validation/admin.validation')
const AdminService = require('../services/admin.service')

async function createAdmin(req, res, next) {
    try {
        const {error, value} = AdminSchema.createAdminSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await AdminService.createAdmin(value)

        return res.status(201).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function getJWT(req, res, next) {
    try {
        const {error, value} = AdminSchema.loginAdminSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        const jwt = await AdminService.getJWT(value)

        return res.status(200).json({
            success: true,
            token: jwt
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createAdmin,
    getJWT
}