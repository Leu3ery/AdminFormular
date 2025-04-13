const LocationSchema = require('../validation/location.validation')
const LocationService = require('../services/location.service')

async function createLocation(req, res, next) {
    try {
        const {error, value} = LocationSchema.createLocationSchema.validate(req.body)

        if (error) {
            res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await LocationService.createLocation(value, req.id.id)
        
        return res.status(201).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function getList(req, res, next) {
    try {
        const data = await LocationService.getList(req.id.id)
        
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function getInfo(req, res, next) {
    try {
        const {locationId} = req.params

        const data = await LocationService.getInfo(locationId)

        return res.status(200).json({
            success: true,
            data
        }) 
    } catch (error) {
        next(error)
    }
}

async function updateLocation(req, res, next) {
    try {
        const {locationId} = req.params

        const {error, value} = LocationSchema.updateLocationSchema.validate(req.body)

        if (error) {
            res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        await LocationService.updateLocation(locationId, value, req.id.id)
        
        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function deleteLocation(req, res, next) {
    try {
        const {locationId} = req.params

        await LocationService.deleteLocation(locationId, req.id.id)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createLocation,
    getList,
    getInfo,
    updateLocation,
    deleteLocation
}