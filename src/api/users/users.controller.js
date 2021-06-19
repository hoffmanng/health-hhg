const UsersService = require('./users.service');

exports.add = async (req, res, next) => {
    try {
        const result = await UsersService.add(req.body);
        res.status(201).send({ id: result._id });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.list = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    try {
        const result = await UsersService.list({ limit, page });
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const result = await UsersService.get(req.params.userId);
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await UsersService.delete(req.params.userId);
        res.status(200).send('Successfully deleted');
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const result = req.jwt;
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};
