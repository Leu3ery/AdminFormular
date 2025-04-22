const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = (req, res, next) => {
    try {
        let adminId;
        let code = req.query.code

        const Token = req.headers['authorization']?.split(' ')[1]
        if (Token) {
            adminId = jwt.verify(Token, config.JWT_SECRET_ADMIN)?.id
        }

        if (!adminId && !code) {
            throw new Error("JWT or code is required")
        }

        req.admin = {id:adminId}
        req.code = code
        next()
    } catch (error) {
        next(error)
    }
}