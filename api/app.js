var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var puzzlesRouter = require('./routes/puzzles');
const cors = require("cors");
var app = express();

//let corsOptions = {
//  origin: 'https://api.zabzabdoda.com',
//  optionsSuccessStatus: 200,
//  credentials: true,
//};

//app.use(cors(corsOptions));
app.use(cors());

//app.options('/',(req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  if(req.method === 'OPTIONS'){
//    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET,');
//    return res.status(200).json({});
//  }
//  next();
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
puzzlesRouter.use(cors());
app.use('/puzzles', puzzlesRouter);

app.use(express.json());

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
