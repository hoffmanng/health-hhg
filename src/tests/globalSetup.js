// eslint-disable-next-line import/no-extraneous-dependencies
const { setup: setupDevServer } = require('jest-dev-server');
// eslint-disable-next-line prefer-destructuring
const port = require('../common/env.config').port;

module.exports = async function globalSetup() {
    await setupDevServer({
        command: 'node ./src/index.js',
        launchTimeout: 10000,
        port
    });

    console.log('globalSetup.js was invoked');
};
