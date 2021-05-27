const DatapointsController = require('./datapoints.controller');
const AuthenticationController = require('../auth/authentication.controller');

exports.routesConfig = (app) => {
    app.post('/datapoints', [
        AuthenticationController.validJWTNeeded,
        DatapointsController.add
    ]);
    app.get('/datapoints', [
        AuthenticationController.validJWTNeeded,
        DatapointsController.list
    ]);
    app.get('/datapoints/:id', [
        AuthenticationController.validJWTNeeded,
        DatapointsController.get
    ]);
    app.delete('/datapoints/:id', [
        AuthenticationController.validJWTNeeded,
        DatapointsController.delete
    ]);
};
