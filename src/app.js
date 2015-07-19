var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var UserController = require('./controllers/user_controller');

var app = express();
var userController = new UserController();

mongoose.connect('mongodb://localhost/node-web-starter');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');

app.post('/register', userController.registerUser);
app.get('/view_test', function(req, res) {
  res.render('index', {title: 'Hey', message: 'Hello, there!'});
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
