'use strict';
/*
** MODULES
*/
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

/*
** ROUTES
*/
const launcher = require('./routes/launcher');
const user = require('./routes/user');

/*
** GLOBALS
*/
global.config = require("./Config/config");
global.translate = require("./Config/translate");

const app = express();

app.use(function (req, res, next) {
    res.locals.domain = global.config.domain;
    next();
});

/*
** MIDDLEWARES
*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet());

/* Basic routes */
app.use('/launcher', launcher);
app.use('/user', user);

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
