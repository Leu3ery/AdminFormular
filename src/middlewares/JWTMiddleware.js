const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = (req, res, next) => {
    try {
        const Token = req.headers['authorization']?.split(' ')[1]
        if (!Token) {
            return res.status(400).json({
                success: false,
                message: "JWT ist required"
            })
        }

        req.id = jwt.verify(Token, config.JWT_SECRET)
        next()
    } catch (error) {
        next(error)
    }
}