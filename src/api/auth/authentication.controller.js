const jwt = require('jsonwebtoken');
const jwtSecret = require('../../common/env.config.js').jwt_secret;
const jwtValidityInSec = require('../../common/env.config.js').jwt_expiration_in_seconds;
const UsersService = require('../users/users.service');
const AuthHelper = require('../../common/auth.helper');

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

exports.login = async (req, res, next) => {
    try {
        const user = await UsersService.findByEmail({ email: req.body.email });
        const accessToken = jwt.sign(user, jwtSecret);
        const cookieExpirationTime = new Date(Date.now() + jwtValidityInSec * 1000);
        res.cookie('jwt', accessToken, { expires: cookieExpirationTime, httpOnly: true });
        res.status(200).send({ accessToken });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('name');
        res.clearCookie('jwt');
        res.status(200).send({ message: 'Successfully logged out' });
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
        const authorizationHeader = req.headers.authorization;
        const jwtCookie = req.cookies.jwt;
        if (!authorizationHeader && !jwtCookie) {
            // 401
            throw new Error('Unauthorized');
        }
        const jwtToken = jwtCookie || req.headers.authorization.split(' ')[1];
        // 403
        req.jwt = jwt.verify(jwtToken, jwtSecret);

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
