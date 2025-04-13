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
        
        res.status(201).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function getList(req, res, next) {
    try {
        const data = await LocationService.getList(req.id.id)
        
        res.status(200).json({
            success: true,
            data
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createLocation,
    getList
}