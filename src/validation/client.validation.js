const Joi = require('joi')

const createClient = Joi.object({
    firstName: Joi.string().trim().min(3).max(255).required(),
    lastName: Joi.string().trim().min(3).max(255).required(),
    mail: Joi.string().trim().email().min(3).max(255).optional(),
    phone: Joi.string().trim().pattern(/^\+\d{8,15}$/, "Austrian phone").required(),
    birthday: Joi.string().trim().isoDate().required(),
    photo: Joi.string().trim()
})

const updateClient = Joi.object({
    firstName: Joi.string().trim().min(3).max(255).optional(),
    lastName: Joi.string().trim().min(3).max(255).optional(),
    mail: Joi.string().trim().email().min(3).max(255).optional(),
    phone: Joi.string().trim().pattern(/^\+\d{8,15}$/, "Austrian phone").optional(),
    birthday: Joi.string().trim().isoDate().optional(),
    photo: Joi.string().trim().optional()
}).min(1)


const getClientsList = Joi.object({
    limit: Joi.number().integer().min(1),
    offset: Joi.number().integer().min(0),
    id: Joi.number().integer().min(0),
    phone: Joi.string().trim().pattern(/^\+\d{0,15}$/, "Austrian phone"),
    firstName: Joi.string().trim().min(1).max(255),
    lastName: Joi.string().trim().min(1).max(255),
})

module.exports = {
    createClient,
    updateClient,
    getClientsList
}