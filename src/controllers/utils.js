const createError = require('http-errors')

function validationWrapper(schema, data) {
    const {error, value} = schema.validate(data, {abortEarly: false})

    if (error) {
        console.log(error)
        throw new createError(400, error.details.reduce((m1, m2) => m1.message + " " + m2.message))
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