/* eslint-disable prefer-destructuring */
const mongoose = require('../../common/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const diagnosticsSchema = new Schema({
    startupTime: { type: Date, default: Date.now },
    appVersion: { type: String, required: true }
});

const DiagnosticData = mongoose.model('diagnostics', diagnosticsSchema);

exports.add = async (data) => {
    const newEntry = new DiagnosticData(data);
    return newEntry.save();
};

exports.list = async ({ limit, page }) => {
    const count = await DiagnosticData.find().countDocuments();
    const resources = await DiagnosticData.find()
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ startupTime: -1 })
        .exec();
    return {
        count,
        limit,
        page,
        resources
    };
};

exports.get = async () => {
    return DiagnosticData.find().sort({ startupTime: -1 }).limit(1);
};
