const UserModel = require('./users.model');
const validityTime = require('../../common/env.config.js').jwt_expiration_in_seconds;
const AuthHelper = require('../../common/auth.helper');

exports.findByEmail = async ({ email, sendHash }) => {
    const result = await UserModel.findByEmail(email);
    let data = {};
    if (result.length <= 0) {
        return data;
    }
    data = {
        userId: result[0]._id,
        email: result[0].email,
        expireAt: Date.now() / 1000 + validityTime,
        permissionLevel: result[0].permissionLevel
    };
    if (sendHash === true) {
        data.hash = result[0].hash;
        data.salt = result[0].salt;
    }
    return data;
};

exports.add = async (userData) => {
    const { email, password } = userData;
    if (!email || !password) {
        throw new Error('Email or Password is missing');
    }
    const salt = AuthHelper.generateSalt();
    const hash = AuthHelper.getHash(salt, password);
    const data = { email, hash, salt, permissionLevel: 1 };
    return UserModel.add(data);
};

exports.list = async ({ limit, page }) => {
    const result = await UserModel.list({ limit, page });
    return result;
};

exports.get = async (id) => {
    const result = await UserModel.get(id);
    return result;
};

exports.delete = async (id) => {
    return UserModel.delete(id);
};
