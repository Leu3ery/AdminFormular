const Joi = require('joi')

const createGame = Joi.object({
    name: Joi.string().min(3).max(64).required(),
    icon: Joi.string().required(),
    color: Joi.string().min(3).max(64).required(),
    maxPlayers: Joi.number().required(),
    LocationId: Joi.number().required()
})

module.exports = {
    createGame
}