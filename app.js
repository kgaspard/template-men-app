var createError = require('http-errors');
var express = require('express');
require('dotenv').config()
const config = require('config');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if (config.get('app.use_db')){
  // Mongo connection
  var mongoose = require('mongoose');
  var mongoDB = process.env.MONGODB_URI;

  mongoose.connect(mongoDB, {dbName:  process.env.MONGODB_DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then( () => {
    console.log('Connection to the Mongo DB Cluster is successful!')
  })
  .catch( (err) => console.error(err));

  // Sessions
  const session = require('express-session');
  const MongoStore = require('connect-mongo')(session);
  app.use(session({
    secret: process.env.MONGOSTORE_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
  }));
}

// Routes

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;