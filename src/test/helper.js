var mongoose = require('mongoose');

before(function() {
  console.log("Setting up testing database");
  mongoose.connect('mongodb://localhost/christmasListTest');
});

after(function() {
  mongoose.disconnect(function() {
    console.log("Database disconnected.")
  });
});
