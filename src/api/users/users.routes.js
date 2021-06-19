const UsersController = require('./users.controller');
const AuthenticationController = require('../auth/authentication.controller');

exports.routesConfig = (app) => {
    app.post('/users', [
        AuthenticationController.checkAuthFields,
        AuthenticationController.checkEmailDuplicate,
        UsersController.add
    ]);
    app.get('/users', [
        AuthenticationController.validJWTNeeded,
        UsersController.list
    ]);
    app.get('/users/:userId', [
        AuthenticationController.validJWTNeeded,
        UsersController.get
    ]);
    app.delete('/users/:userId', [
        AuthenticationController.validJWTNeeded,
        UsersController.delete
    ]);
    app.get('/user', [
        AuthenticationController.validJWTNeeded,
        UsersController.getUser
    ]);
};
