var mongoose = require('mongoose');

before(function() {
  mongoose.connect('mongodb://localhost/node-web-starter-test');
});

after(function() {
  mongoose.disconnect(function() {});
});
