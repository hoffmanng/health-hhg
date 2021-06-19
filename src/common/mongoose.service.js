const mongoose = require('mongoose');

const options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(`Could not connect to MongoDB at ${process.env.MONGODB_URI}`);
    }
};

(async () => {
    await connect();
})();

exports.mongoose = mongoose;
