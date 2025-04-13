const Joi = require('joi')

const createLocationSchema = Joi.object({
    address: Joi.string().min(3).max(64).required(),
    city: Joi.string().min(3).max(64).required(),
    postcode: Joi.string().min(3).max(64).required(),
    phone: Joi.string().min(3).max(64).required(),
    mail: Joi.string().min(3).max(64).required()
})

module.exports = {
    createLocationSchema
}