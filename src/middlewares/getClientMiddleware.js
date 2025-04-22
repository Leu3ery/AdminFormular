const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = (req, res, next) => {
    try {
        let adminId;
        let password = req.query.password

        const Token = req.headers['authorization']?.split(' ')[1]
        if (Token) {
            adminId = jwt.verify(Token, config.JWT_SECRET_ADMIN).id
        }

        if (!adminId && !password) {
            throw new Error("JWT of password is required")
        }

        req.admin = {id:adminId}
        req.password = password
        next()
    } catch (error) {
        next(error)
    }
}