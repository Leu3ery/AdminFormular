const Joi = require('joi')

const createClient = Joi.object({
    firstName: Joi.string().trim().min(3).max(64).required(),
    lastName: Joi.string().trim().min(3).max(64).required(),
    mail: Joi.string().trim().email().min(3).max(255).optional(),
    phone: Joi.string().trim().pattern(/^\+\d{8,15}$/, "Austrian phone").optional(),
    birthday: Joi.string().trim().isoDate().required(),
    photo: Joi.string().trim().required()
})

const updateClient = Joi.object({
    firstName: Joi.string().trim().min(3).max(64).optional(),
    lastName: Joi.string().trim().min(3).max(64).optional(),
    mail: Joi.string().trim().email().min(3).max(255).optional(),
    phone: Joi.string().trim().pattern(/^\+\d{8,15}$/, "Austrian phone").optional(),
    birthday: Joi.string().trim().isoDate().optional(),
    photo: Joi.string().trim().optional()
}).min(1)

module.exports = {
    createClient,
    updateClient
}