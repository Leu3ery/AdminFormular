const GameService = require('../services/game.service')
const GameSchema = require('../validation/game.validation')
const fs = require('fs')

// {
//     fieldname: 'file',
//     originalname: 'ORM_Escapers (3).drawio (6).png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: 'uploads/',
//     filename: 'f786e972f94f94c07a936a87e9059094',
//     path: 'uploads/f786e972f94f94c07a936a87e9059094',
//     size: 173687
//   }
//   { name: 'string', icon: 'string', color: 'string', maxPlayers: 0 }
  

async function createGameOnLocation(req, res, next) {
    try {
        const {locationId} = req.params
        const adminId = req.admin.id

        const jsonData = JSON.parse(req.body.data)

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "file is required"
            })
        }

        jsonData.icon = req.file?.filename
        jsonData.LocationId = locationId

        const {error, value} = GameSchema.createGame.validate(jsonData)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }

        const data = await GameService.createGame(value, locationId, adminId)

        return res.status(201).json({
            success: true,
            data: data
        })
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, unlinkErr => {
              if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
            });
        }
        next(error)
    }
}

async function getGameListOnLocation(req, res, next) { 
    try {
        const {locationId} = req.params

        const data = await GameService.getGameListOnLocation(locationId)

        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

async function getGameInfoOnLocation(req, res, next) {
    try {
        const {locationId, gameId} = req.params

        const data = await GameService.getGameInfoOnLocation(locationId, gameId)

        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

async function deleteGameOnLocation(req, res, next) {
    try {
        const {locationId, gameId} = req.params
        const adminId = req.admin.id

        await GameService.deleteGameOnLocation(locationId, gameId, adminId)

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        next(error)
    }
}

async function updateGameOnLocation(req, res, next) {
    try {
        const {locationId, gameId} = req.params
        const adminId = req.admin.id
        const jsonData = req.body.data ? JSON.parse(req.body.data) : {}
        if (req.file?.filename) {
            jsonData.icon = req.file?.filename
        }
        const {error, value} = GameSchema.updateGameOnLocation.validate(jsonData)

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(error => error.message)
            })
        }
        
        const newObject = await GameService.updateGameOnLocation(locationId, gameId, adminId, value)

        return res.status(200).json({
            success: true,
            data: newObject
        })
    } catch (error) {
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, unlinkErr => {
              if (unlinkErr) console.error("Failed to delete file:", unlinkErr);
            });
        }
        next(error)
    }
}


module.exports = {
    createGameOnLocation,
    getGameListOnLocation,
    getGameInfoOnLocation,
    deleteGameOnLocation,
    updateGameOnLocation
}