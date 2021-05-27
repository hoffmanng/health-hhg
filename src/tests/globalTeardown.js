// eslint-disable-next-line import/no-extraneous-dependencies
const { teardown: teardownDevServer } = require('jest-dev-server');

module.exports = async function globalTeardown() {
    await teardownDevServer();
    console.log('globalTeardown.js was invoked');
};
