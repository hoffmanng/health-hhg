/* eslint-disable no-underscore-dangle */
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const AuthRouter = require('./api/auth/auth.routes');
const UsersRouter = require('./api/users/users.routes');
const DatapointsRouter = require('./api/datapoints/datapoints.routes');
const DiagnosticsRouter = require('./api/diagnostics/diagnostics.routes');
const ErrorHandlerMiddleware = require('./common/errorhandler.middleware');
const DiagnosticsService = require('./api/diagnostics/diagnostics.service');

const app = express();

if (!process.env.JWT_SECRET) {
    console.log('JWT secret is not set up!');
    process.exit(1);
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    if (process.env.NODE_ENV.toLowerCase() === 'production') {
        res.header('Access-Control-Allow-Origin', '*');
    } else {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    return next();
});

AuthRouter.routesConfig(app);
UsersRouter.routesConfig(app);
DatapointsRouter.routesConfig(app);
DiagnosticsRouter.routesConfig(app);

app.use(ErrorHandlerMiddleware.notFoundHandler);
app.use(ErrorHandlerMiddleware.defaultErrorHandler);

app.listen(process.env.PORT, async () => {
    try {
        const result = await DiagnosticsService.logStartupTime();
        console.log({
            appVersion: result._doc.appVersion,
            startupTime: result._doc.startupTime
        });
    } catch (err) {
        console.log(err.message);
    }
    console.log(`Listening on port ${process.env.PORT}`);
});
