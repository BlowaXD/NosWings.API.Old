const express = require("express");
const helmet = require("helmet");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./Config/config");
const translate = require("./Config/translate");

global.config = config;
global.translate = translate;

const launcher = require('./routes/launcher/index');
const shop = require('./routes/shop/index');
const admin = require('./routes/shop/admin');
const moderator = require('./routes/shop/moderator');

const app = express();

app.use(function (req, res, next) {
    res.locals.domain = global.config.domain;
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/launcher', launcher);
app.use('/', shop);
app.use('/admin', admin);
app.use('/moderator', moderator);

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
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
