const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    port: process.env.PORT || 3600,
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiration_in_seconds: 864000,
    mode: process.env.MODE,
    permissionLevels: {
        NORMAL_USER: 1,
        PAID_USER: 4,
        ADMIN: 2048
    }
};
