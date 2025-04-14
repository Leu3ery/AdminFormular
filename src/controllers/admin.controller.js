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

        await AdminService.createAdmin(value, req.id.id)

        return res.status(201).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function getAdminJWT(req, res, next) {
    try {
        const {error, value} = AdminSchema.loginAdminSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        const jwt = await AdminService.getAdminJWT(value)

        return res.status(200).json({
            success: true,
            token: jwt
        })
    } catch (error) {
        next(error)
    }
}

async function getAdminInfo(req, res, next) {
    try {
        const data = await AdminService.getAdminInfo(req.id.id)
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function getAdminList(req, res, next) {
    try {
        const data = await AdminService.getAdminList(req.id.id)
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function getAdminInfoById(req, res, next) {
    try {
        const {adminId} = req.params
        const data = await AdminService.getAdminInfoById(req.id.id, adminId)
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function updateAdmin(req, res, next) {
    try {
        const {adminId} = req.params
        const {error, value} = AdminSchema.updateAdminSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await AdminService.updateAdmin(value, req.id.id, adminId)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function deleteAdmin(req, res, next) {
    try {
        const {adminId} = req.params

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await AdminService.deleteAdmin(req.id.id, adminId)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function connectLocationWithAdmin(req, res, next) {
    try {
        const {adminId} = req.params
        const {error, value} = AdminSchema.connectLocationSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await AdminService.connectLocationWithAdmin(adminId, value.locationId, req.id.id)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function getAdminLocations(req, res, next) {
    try {
        const {adminId} = req.params
        
        const data = await AdminService.getAdminLocations(adminId, req.id.id)

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function deleteAdminLocation(req, res, next) {
    try {
        const {adminId, locationId} = req.params

        await AdminService.deleteAdminLocation(adminId, locationId, req.id.id)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
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
    deleteAdminLocation
}