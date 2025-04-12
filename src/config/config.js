const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', '..', '.env')});

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_SALT: process.env.PASSWORD_SALT
}