'use strict';
/*
** MODULES
*/
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

/*
** GLOBALS
*/
global.config = require("./Config/config");
global.translate = require("./Config/translate");

/*
** ROUTES
*/
const routes = require('./routes');
const route_launcher = routes.launcher;
const route_user = routes.user;

/*
** SETUP EXPRESS
*/
const app = express();

/*
** MIDDLEWARES
*/
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

/* Basic routes */
app.use('/launcher', route_launcher);
app.use('/user', route_user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.sendStatus(err.status || 500);
});

module.exports = app;
