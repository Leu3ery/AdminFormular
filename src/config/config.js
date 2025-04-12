const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', '..', '.env')});

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
    JWT_SECRET_USER: process.env.JWT_SECRET_USER,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    SUPERADMIN_DATA: process.env.SUPERADMIN_DATA
}