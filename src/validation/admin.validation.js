const Joi = require('joi')

const createAdminSchema = Joi.object({
    firstName: Joi.string().trim().min(3).max(64).required(),
    lastName: Joi.string().trim().min(3).max(64).required(),
    username: Joi.string().trim().min(3).max(64).required(),
    password: Joi.string().trim().min(3).max(64).required(),
})

const loginAdminSchema = Joi.object({
    username: Joi.string().trim().min(3).max(64).required(),
    password: Joi.string().trim().min(3).max(64).required(),
})

const updateAdminSchema = Joi.object({
    firstName: Joi.string().trim().min(3).max(64),
    lastName: Joi.string().trim().min(3).max(64),
    password: Joi.string().trim().min(3).max(64),
    username: Joi.string().trim().min(3).max(64),
}).min(1)

module.exports = {
    createAdminSchema,
    loginAdminSchema,
    updateAdminSchema
}