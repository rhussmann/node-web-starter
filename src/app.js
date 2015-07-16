var bodyParser = require('body-parser');
var express = require('express');
var Emailer = require('./controllers/emailer');
var Mailer = require('./controllers/mailer');

var app = express();
var emailer = new Emailer({
  createVerificationRecord: function(user, callback) {
    callback(null, "http://christmastime.com");
  }
}, new Mailer());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/register', function(req,res) {
  emailer.sendVerificationEmail({email: req.body.email}, function(err) {
    if(err) {
      console.log("Error sending registration email: " + err);
    }
    res.sendStatus((err) ? 500 : 201);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
