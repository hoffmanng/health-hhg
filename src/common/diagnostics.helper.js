const packageJsonVersion = require('../../package.json');

exports.getAppVersion = () => {
    return packageJsonVersion.version;
};
