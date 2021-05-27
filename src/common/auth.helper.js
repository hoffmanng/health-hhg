const crypto = require('crypto');

exports.generateSalt = () => {
    return crypto.randomBytes(16).toString('base64');
};

exports.getHash = (salt, password) => {
    return crypto.createHmac('sha512', salt).update(password).digest('base64');
};
