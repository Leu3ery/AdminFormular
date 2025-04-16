const Joi = require('joi')

const createRoomSchema = Joi.object({
    LocationId: Joi.number().required(),
    GameId: Joi.number().required(),
})

module.exports = {
    createRoomSchema
}