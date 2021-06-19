const DatapointModel = require('./datapoints.model');
const { ResponseError } = require('../../common/responseErrors');

exports.add = async (data) => {
    const transformedData = { ...data };
    transformedData.createdAt = Date.parse(data.createdAt) || Date.now();
    return DatapointModel.add(transformedData);
};

exports.list = async ({ limit, page, filter }) => {
    if (!filter.userId) {
        throw new ResponseError(400, 'UserId filter is missing');
    }
    return DatapointModel.list({ limit, page, filter });
};

exports.get = async (id) => {
    return DatapointModel.get(id);
};

exports.delete = async (id) => {
    return DatapointModel.delete(id);
};

exports.deleteAll = async (userId) => {
    return DatapointModel.deleteAll(userId);
};
