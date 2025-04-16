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

        const data = await AdminService.createAdmin(value, req.admin.id)

        return res.status(201).json({
            success: true,
            data: data
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
        const data = await AdminService.getAdminInfo(req.admin.id)
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
        const data = await AdminService.getAdminList(req.admin.id)
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
        const data = await AdminService.getAdminInfoById(req.admin.id, adminId)
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

        const data = await AdminService.updateAdmin(value, req.admin.id, adminId)

        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

async function deleteAdmin(req, res, next) {
    try {
        const {adminId} = req.params

        await AdminService.deleteAdmin(req.admin.id, adminId)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function connectLocationWithAdmin(req, res, next) {
    try {
        const {adminId, locationId} = req.params

        await AdminService.connectLocationWithAdmin(adminId, locationId, req.admin.id)

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
        
        const data = await AdminService.getAdminLocations(adminId, req.admin.id)

        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function getMyLocations(req, res, next) {
    try {
        const adminId = req.admin.id
        const data = await AdminService.getMyLocations(adminId)

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

        await AdminService.deleteAdminLocation(adminId, locationId, req.admin.id)

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
    getMyLocations,
    deleteAdminLocation
}