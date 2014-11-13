var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var debug = require('debug')('apiproject');


var User = require('./api/User')

var app = express();


app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ABCOWFWEFWKDC237634274CHMCJGSDF',resave: true,
    saveUninitialized: true}))

var db;
var url = 'mongodb://107.170.72.89:29065/Pricehowl';
//Use connect method to connect to the Server
MongoClient.connect(url, function(err, database) {
    assert.equal(null, err);
    if(err) console.log(err);
    else{
      db=database;
    }
});

app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/user/:userID/chekinHistory', function(req, res, next){
    User.checkInHistory(req, res, next);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message : "Not found"});
});

app.set('port', process.env.PORT || 3015);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


module.exports = app;
