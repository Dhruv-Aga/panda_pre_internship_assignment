// var http = require('http'),
//     path = require('path'),
//     methods = require('methods'),
//     express = require('express'),
//     bodyParser = require('body-parser'),
//     session = require('express-session'),
//     cors = require('cors'),
//     passport = require('passport'),
//     errorhandler = require('errorhandler'),
//     mongoose = require('mongoose');
//     mailer = require('express-mailer');
//     ip = require('../config').ip;
 
// var isProduction = process.env.NODE_ENV === 'production';

// // Create global app object
// var app = express();


// app.use(cors());

// // Normal express config defaults
// app.use(require('morgan')('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(require('method-override')());
// app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
// app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// if (!isProduction) {
//   app.use(errorhandler());
// }

// if(isProduction){
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect('mongodb://dhruv_agarwal:dhruvaga11@ds155293.mlab.com:55293/quizingga');
//   mongoose.set('debug', true);
// }

// require('./models/College');
// require('./models/User');
// require('./config/passport');
// require('./config/mailer');

// app.use(require('./routes'));
 
// var mailing = function(to,subject,body){
//   var mailOptions = {
//       from: 'dhruv.1610051@kiet.edu', // sender address
//       to: to, // list of receivers
//       subject: subject, // Subject line
//       text: body //, // plaintext body
//       // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
//   };
//   transporter.sendMail(mailOptions, function(error, info){
//       if(error){
//           console.log(error);
//           res.json({yo: 'error'});
//       }else{
//           console.log('Message sent: ' + info.response);
//           res.json({yo: info.response});
//       };
//   });
// }

// // /// catch 404 and forward to error handler
// // app.use(function(req, res, next) {
// //   console.log([req])
// //   // alert();
// //   var err = new Error('Not Found');
// //   err.status = 404;
// //   next(err);
// // });

// /// error handlers

// // development error handler
// // will print stacktrace
// if (!isProduction) {
//   app.use(function(err, req, res, next) {
//     console.log(err.stack);

//     res.status(err.status || 500);

//     res.json({'errors': {
//       message: err.message,
//       error: err
//     }});
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json({'errors': {
//     message: err.message,
//     error: {}
//   }});
// });


// console.log(process.env)
// // finally, let's start our server...
// var server = app.listen( process.env.PORT || 3000, process.env.IP, function(){
//   console.log('Listening on port ' + server.address().address+":"+server.address().port);
// });
