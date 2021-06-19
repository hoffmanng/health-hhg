// eslint-disable-next-line no-unused-vars
exports.defaultErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const type = err.type || 'UnknownError';
    const message = err.message || 'Something went wrong.';

    console.log(`Fired errorHandler: code=${statusCode}, type=${type}, message=${message}`);
    res.status(statusCode).send({ message });
};

// eslint-disable-next-line no-unused-vars
exports.notFoundHandler = (req, res, next) => {
    console.log(`Fired notFoundHandler: route=${req.originalUrl}`);
    res.status(404).send({ message: `Route ${req.originalUrl} not found` });
};
