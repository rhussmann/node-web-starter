var config = require('../config-test');
var mongoose = require('mongoose');

before(function() {
  mongoose.connect(config.mongo_url);
});

after(function() {
  mongoose.disconnect(function() {});
});
