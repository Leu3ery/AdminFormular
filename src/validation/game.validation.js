const Joi = require('joi')

const createGame = Joi.object({
    name: Joi.string().trim().min(3).max(64).required(),
    icon: Joi.string().trim().required(),
    color: Joi.string().trim().min(3).max(64).required(),
    maxPlayers: Joi.number().required(),
    LocationId: Joi.number().required()
})

const updateGameOnLocation = Joi.object({
    name: Joi.string().trim().min(3).max(64),
    icon: Joi.string().trim(),
    color: Joi.string().trim().min(3).max(64),
    maxPlayers: Joi.number(),
    LocationId: Joi.number()
}).min(1)

module.exports = {
    createGame,
    updateGameOnLocation
}