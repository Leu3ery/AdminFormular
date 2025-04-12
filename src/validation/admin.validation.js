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

module.exports = {
    createAdminSchema,
    loginAdminSchema
}