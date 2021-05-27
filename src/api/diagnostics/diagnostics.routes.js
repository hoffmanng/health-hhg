const DiagnosticsController = require('./diagnostics.controller');

exports.routesConfig = (app) => {
    app.get('/diag', [
        DiagnosticsController.get
    ]);
};
