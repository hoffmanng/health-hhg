const AuthenticationController = require('./authentication.controller');

exports.routesConfig = (app) => {
    app.post('/login', [
        AuthenticationController.checkAuthFields,
        AuthenticationController.validateUserAndPassword,
        AuthenticationController.login
    ]);
    app.post('/logout', [
        AuthenticationController.logout
    ]);
};
