const jwt = require('jsonwebtoken');
const jwtSecret = require('../../common/env.config.js').jwt_secret;
const UsersService = require('../users/users.service');
const AuthHelper = require('../../common/auth.helper');

exports.login = async (req, res, next) => {
    try {
        const user = await UsersService.findByEmail({ email: req.body.email });
        const accessToken = jwt.sign(user, jwtSecret);
        res.status(200).send({ accessToken });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.checkAuthFields = (req, res, next) => {
    const errors = [];

    if (!req.body.email) {
        errors.push('Missing email field');
    }
    if (!req.body.password) {
        errors.push('Missing password field');
    }
    if (errors.length) {
        // 400
        const err = new Error(errors.join(', '));
        console.log(err.message);
        next(err);
    }
    next();
};

exports.validateUserAndPassword = async (req, res, next) => {
    let user;
    try {
        user = await UsersService.findByEmail({ email: req.body.email, sendHash: true });
        if (!user.email) {
            // 400
            throw new Error('Invalid e-mail or password');
        }
        const dbHash = user.hash;
        const dbSalt = user.salt;
        const localHash = AuthHelper.getHash(dbSalt, req.body.password);
        if (localHash !== dbHash) {
            // 400
            throw new Error('Invalid e-mail or password');
        }
        next();
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.checkEmailDuplicate = async (req, res, next) => {
    let user;
    try {
        user = await UsersService.findByEmail({ email: req.body.email });
        if (!!user.email) {
            // 400
            throw new Error('Email address already exists');
        }
    } catch (err) {
        console.log(err.message);
        next(err);
    }
    next();
};

exports.validJWTNeeded = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            // 401
            throw new Error('Unauthorized');
        }
        const authorization = req.headers.authorization.split(' ');
        // 403
        req.jwt = jwt.verify(authorization[1], jwtSecret);

        if (req.jwt.expireAt && req.jwt.expireAt < Date.now() / 1000) {
            // 401
            throw new Error('Unauthorized');
        }
    } catch (err) {
        console.log(err.message);
        next(err);
    }
    next();
};
