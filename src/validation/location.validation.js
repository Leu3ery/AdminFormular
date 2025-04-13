const Joi = require('joi')

const createLocationSchema = Joi.object({
    address: Joi.string().min(3).max(64).required(),
    city: Joi.string().min(3).max(64).required(),
    postcode: Joi.string().min(3).max(64).required(),
    phone: Joi.string().min(3).max(64).required(),
    mail: Joi.string().min(3).max(64).required()
})

const updateLocationSchema = Joi.object({
    address: Joi.string().min(3).max(64),
    city: Joi.string().min(3).max(64),
    postcode: Joi.string().min(3).max(64),
    phone: Joi.string().min(3).max(64),
    mail: Joi.string().min(3).max(64)
}).min(1)

module.exports = {
    createLocationSchema,
    updateLocationSchema
}