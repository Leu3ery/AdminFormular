const createError = require('http-errors')

function validationWrapper(schema, data) {
    const {error, value} = schema.validate(data, {abortEarly: false})

    if (error) {
        throw new createError(400, error.details.map(d => d.message))
    }

    return value
}

function success(res, status, data={}) {
    res.status(status).json({
        success: true,
        ...data
    })
}

module.exports = {
    validationWrapper,
    success
}