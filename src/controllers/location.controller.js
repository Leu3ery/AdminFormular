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

async function getLocationList(req, res, next) {
    try {
        const data = await LocationService.getLocationList()
        
        return res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

async function getLocationInfo(req, res, next) {
    try {
        const {locationId} = req.params

        const data = await LocationService.getLocationInfo(locationId)

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
    getLocationList,
    getLocationInfo,
    updateLocation,
    deleteLocation
}