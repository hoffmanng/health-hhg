// eslint-disable-next-line import/no-extraneous-dependencies
const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async function globalSetup() {
    await setupDevServer({
        command: 'node ./src/index.js',
        launchTimeout: 10000,
        port: process.env.PORT
    });

    console.log('globalSetup.js was invoked');
};
