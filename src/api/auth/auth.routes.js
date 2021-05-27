const AuthenticationController = require('./authentication.controller');

exports.routesConfig = (app) => {
    app.post('/auth', [
        AuthenticationController.checkAuthFields,
        AuthenticationController.validateUserAndPassword,
        AuthenticationController.login
    ]);
};
