var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var testApiRouter = require('./routes/testApi');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
const localesRouter = require('./routes/locales');

const common = require("./common.js");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function authorizer(req, res, next) {
  function reject() {
    res.setHeader('www-authenticate', 'Basic');
    res.sendStatus(401);
  };

  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(authorization.replace('Basic ', ''), 'base64').toString().split(':');

  let pwdAccess = common.serverConfig.passwordAccess;
  if (
    !(username === pwdAccess.username
      && password === pwdAccess.password)
  ) {
    return reject();
  }

  next();
}

if (common.serverConfig.passwordAccess.password != '')
  app.use(authorizer)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'static/public')));

if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
  app.use('/tests', express.static(path.join(__dirname, 'static/tests')));
}

// if (common.serverConfig.testConfig.testApiEnabled) {
//   // api for tests during dev, DISABLE for prod
//   app.use(Object.keys(common.serverConfig.testApi)[0], testApiRouter);
// }
app.use('/', indexRouter);
app.use(Object.keys(common.serverConfig.api)[0], apiRouter);
app.use('/locales', localesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
