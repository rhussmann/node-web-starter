var config = require('./config');

var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var UserController = require('./controllers/user_controller');

var app = express();

var verificationRecorder = require('./controllers/verification_recorder');
var Emailer = require('./controllers/emailer');
var Mailer = require('./controllers/mailer');
var mailer = new Emailer(verificationRecorder, new Mailer(config.gmail_user, config.gmail_pass));

var userController = new UserController(mailer);

mongoose.connect(config.mongo_url);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');

function generateTemplateRenderer(templateName) {
  return function(req,res) {
    res.render(templateName);
  }
}

function wrapControllerMethod(controller, controllerMethod) {
  return function(req, res, callback) {
    controller[controllerMethod](req, res, callback);
  }
}

app.post('/register', wrapControllerMethod(userController, 'registerUser'));
app.get('/registered', generateTemplateRenderer('registered'));
app.get('/login', generateTemplateRenderer('login'));
app.post('/login', userController.login);
app.get('/account_not_verified', generateTemplateRenderer('not_verified'));
app.get('/verify', function(req, res) {
  userController.verifyUser(req.query.verifyToken, function(err) {
    if(err) {
      res.render('error');
    }

    res.redirect(301, "http://www.google.com");
  });
});

var server = app.listen(config.app_port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
