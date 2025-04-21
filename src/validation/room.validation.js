const Joi = require('joi')

const createRoomSchema = Joi.object({
    LocationId: Joi.number().required(),
    GameId: Joi.number().required(),
})

const getRoomList = Joi.object({
    //limit + offset + isActivate + locationId + adminId
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0),
    isActivate: Joi.boolean(),
    locationId: Joi.number().integer(),
    adminId: Joi.number().integer(),
})

const updateRoom = Joi.object({
    // gameId gameTime
    gameId: Joi.number().integer(),
    gameTime: Joi.number().integer().min(1)
}).min(1)

module.exports = {
    createRoomSchema,
    getRoomList,
    updateRoom
}