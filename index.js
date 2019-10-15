var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
    mailer = require('express-mailer');
 
var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();


app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect('mongodb://dhruv_agarwal:dhruvaga11@ds241121.mlab.com:41121/panda');
} else {
  mongoose.connect('mongodb://dhruv_agarwal:dhruvaga11@ds241121.mlab.com:41121/panda');
  mongoose.set('debug', true);
}

require('./models/Cars');
require('./models/User');
require('./config/passport');
require('./config/mailer');

app.use(require('./routes'));
 

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().address+":"+server.address().port);
});