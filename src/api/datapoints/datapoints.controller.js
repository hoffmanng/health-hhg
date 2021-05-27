const DatapointService = require('./datapoints.service');

exports.add = async (req, res, next) => {
    const data = { ...req.body, userId: req.jwt.userId };
    try {
        const result = await DatapointService.add(data);
        res.status(201).send({ id: result._id });
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.list = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const { dataType } = req.query;
    const filter = { userId: req.jwt.userId };
    if (!!dataType) {
        filter.dataType = dataType;
    }
    try {
        const result = await DatapointService.list({ limit, page, filter });
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const result = await DatapointService.get(req.params.id);
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await DatapointService.delete(req.params.id);
        res.status(200).send('Successfully deleted');
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};
