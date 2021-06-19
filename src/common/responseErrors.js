/* eslint-disable max-classes-per-file */
class ResponseError extends Error {
    constructor(status, message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.type = type;
        this.status = status;
    }
}

module.exports = { ResponseError };

module.exports.UnauthorizedError = class extends ResponseError {
    constructor(message) {
        super(401, message || 'Unauthorized', 'UnauthorizedError');
    }
};
