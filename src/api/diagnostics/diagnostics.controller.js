const DiagnosticsService = require('./diagnostics.service');

exports.list = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    try {
        const result = await DiagnosticsService.list({ limit, page });
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const result = await DiagnosticsService.get();
        res.status(200).send(result);
    } catch (err) {
        console.log(err.message);
        next(err);
    }
};
