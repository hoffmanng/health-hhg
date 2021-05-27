const DiagnosticsModel = require('./diagnostics.model');
const DiagnosticsHelper = require('../../common/diagnostics.helper');

exports.add = async () => {
    const appVersion = DiagnosticsHelper.getAppVersion();
    const data = { appVersion };
    return DiagnosticsModel.add(data);
};

exports.list = async ({ limit, page }) => {
    return DiagnosticsModel.list({ limit, page });
};

exports.get = async () => {
    const result = await DiagnosticsModel.get();
    return {
        appVersion: result[0].appVersion,
        startupTime: result[0].startupTime
    };
};

exports.logStartupTime = async () => {
    return this.add();
};
