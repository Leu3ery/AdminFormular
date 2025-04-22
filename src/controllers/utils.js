const createError = require('http-errors')

function validationWrapper(schema, data) {
    const {error, value} = schema.validate(data, {abortEarly: false})

    if (error) {
        console.log(error)
        const msg = error.details
            .map(d => d.message)
            .join("; ");
        throw createError(400, msg);
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