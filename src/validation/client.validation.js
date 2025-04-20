const Joi = require('joi')

const createClient = Joi.object({
    firstName: Joi.string().min(3).max(64).required(),
    lastName: Joi.string().min(3).max(64).required(),
    mail: Joi.string().email().min(3).max(255).optional(),
    phone: Joi.string().pattern(/^\+\d{8,15}$/, "Austrian phone").optional(),
    birthday: Joi.string().isoDate().required(),
    photo: Joi.string().required()
})

const updateClient = Joi.object({
    firstName: Joi.string().min(3).max(64).optional(),
    lastName: Joi.string().min(3).max(64).optional(),
    mail: Joi.string().email().min(3).max(255).optional(),
    phone: Joi.string().pattern(/^\+\d{8,15}$/, "Austrian phone").optional(),
    birthday: Joi.string().isoDate().optional(),
    photo: Joi.string().optional()
}).min(1)

module.exports = {
    createClient,
    updateClient
}