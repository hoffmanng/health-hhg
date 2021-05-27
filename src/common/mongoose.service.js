const mongoose = require('mongoose');
const config = require('./env.config.js');

const options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connect = async () => {
    try {
        await mongoose.connect(config.mongodb_uri, options);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(`Could not connect to MongoDB at ${config.mongodb_uri}`);
    }
};

(async () => {
    await connect();
})();

exports.mongoose = mongoose;
