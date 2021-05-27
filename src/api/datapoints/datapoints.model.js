/* eslint-disable prefer-destructuring */
const mongoose = require('../../common/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const datapointSchema = new Schema({
    dataType: { type: String, enum: ['blood_pressure', 'pulse', 'weight'], required: true },
    value: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.ObjectId, required: true },
    unitOfMeasure: { type: String, required: true }
});

const Datapoint = mongoose.model('datapoints', datapointSchema);

exports.add = async (dataPoint) => {
    const data = new Datapoint(dataPoint);
    return data.save();
};

exports.list = async ({ limit, page, filter }) => {
    const count = await Datapoint.find(filter).countDocuments();
    const resources = await Datapoint.find(filter)
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 })
        .exec();
    return {
        count,
        limit,
        page,
        resources
    };
};

exports.get = async (id) => {
    return Datapoint.findById(id);
};

exports.delete = async (id) => {
    return Datapoint.deleteMany({ _id: id });
};

exports.deleteAll = async (userId) => {
    return Datapoint.deleteMany({ userId });
};
