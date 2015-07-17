var bodyParser = require('body-parser');
var express = require('express');

var Emailer = require('./controllers/emailer');
var Mailer = require('./controllers/mailer');
var UserController = require('./controllers/user_controller');

var app = express();
var emailer = new Emailer({
  createVerificationRecord: function(user, callback) {
    callback(null, "http://christmastime.com");
  }
}, new Mailer());
var userController = new UserController();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/register', userController.registerUser);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
