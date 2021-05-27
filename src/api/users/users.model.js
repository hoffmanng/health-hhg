/* eslint-disable prefer-destructuring */
const mongoose = require('../../common/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    permissionLevel: Number
});

const User = mongoose.model('users', userSchema);

exports.findByEmail = async (email) => {
    return User.find({ email });
};

exports.get = async (id) => {
    return User.findById(id);
};

exports.add = async (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = async ({ limit, page }) => {
    const count = await User.find().countDocuments();
    const resources = await User.find()
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

exports.delete = async (id) => {
    return User.deleteMany({ _id: id });
};
