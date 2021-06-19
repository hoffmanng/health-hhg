const jwt = require('jsonwebtoken');
const UsersService = require('../users/users.service');
const AuthHelper = require('../../common/auth.helper');
const { ResponseError, UnauthorizedError } = require('../../common/responseErrors');

exports.checkAuthFields = (req, res, next) => {
    const errors = [];

    if (!req.body.email) {
        errors.push('Missing email field');
    }
    if (!req.body.password) {
        errors.push('Missing password field');
    }
    if (errors.length) {
        const err = new ResponseError(400, errors.join(', '));
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
            throw new ResponseError(400, 'Invalid e-mail or password');
        }
        const dbHash = user.hash;
        const dbSalt = user.salt;
        const localHash = AuthHelper.getHash(dbSalt, req.body.password);
        if (localHash !== dbHash) {
            throw new ResponseError(400, 'Invalid e-mail or password');
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
        const accessToken = jwt.sign(user, process.env.JWT_SECRET);
        const cookieExpirationTime = new Date(Date.now() + Number(process.env.JWT_EXPIRATION_IN_SEC) * 1000);

        res.cookie('jwt', accessToken, {
            expires: cookieExpirationTime,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV.toLowerCase() === 'production',
            sameSite: 'Strict'
        });
        res.status(200).send({ accessToken });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
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
            throw new ResponseError(400, 'Email address already exists');
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
            throw new UnauthorizedError('Missing basic authorization header or cookie');
        }
        const jwtToken = jwtCookie || req.headers.authorization.split(' ')[1];
        // 403
        req.jwt = jwt.verify(jwtToken, process.env.JWT_SECRET);

        if (req.jwt.expireAt && req.jwt.expireAt < Date.now() / 1000) {
            throw new UnauthorizedError('JWT token expired');
        }
    } catch (err) {
        console.log(err.message);
        next(err);
    }
    next();
};
