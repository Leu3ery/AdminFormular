const Joi = require('joi')

const createLocationSchema = Joi.object({
    address: Joi.string().trim().min(3).max(64).required(),
    city: Joi.string().trim().min(3).max(64).required(),
    postcode: Joi.string().trim().min(3).max(64).required(),
    phone: Joi.string().trim().min(3).max(64).required(),
    mail: Joi.string().email().required()
})

const updateLocationSchema = Joi.object({
    address: Joi.string().trim().min(3).max(64),
    city: Joi.string().trim().min(3).max(64),
    postcode: Joi.string().trim().min(3).max(64),
    phone: Joi.string().trim().min(3).max(64),
    mail: Joi.string().email()
}).min(1)

module.exports = {
    createLocationSchema,
    updateLocationSchema
}