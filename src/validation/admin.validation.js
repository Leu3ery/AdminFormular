const Joi = require('joi')

const createAdminSchema = Joi.object({
    firstName: Joi.string().min(3).max(64).required(),
    lastName: Joi.string().min(3).max(64).required(),
    username: Joi.string().min(3).max(64).required(),
    password: Joi.string().min(3).max(64).required(),
})

const loginAdminSchema = Joi.object({
    username: Joi.string().min(3).max(64).required(),
    password: Joi.string().min(3).max(64).required(),
})

const updateAdminSchema = Joi.object({
    firstName: Joi.string().min(3).max(64),
    lastName: Joi.string().min(3).max(64),
    password: Joi.string().min(3).max(64),
    username: Joi.string().min(3).max(64),
}).min(1)

const connectLocationSchema = Joi.object({
    locationId: Joi.number()
})

module.exports = {
    createAdminSchema,
    loginAdminSchema,
    updateAdminSchema,
    connectLocationSchema
}