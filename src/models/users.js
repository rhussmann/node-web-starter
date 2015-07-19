var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:  {
    type: String,
    lowercase: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  fullName: String
});
var UserModel = mongoose.model('User', userSchema);

// Constructor
function User() {
  // always initialize all instance properties
  this.username = "";
  this.fullName = "";
  this.password = "";
  this.email = "";
  this.verified = false;
  this.model = new UserModel();
}

function createObjectFromModel(model) {
  var newUser = new User();
  newUser.model = model;
  newUser.fullName = model.fullName;
  newUser.email = model.email;
  return newUser;
}

User.prototype.setUsername = function(username) {
  if (username.indexOf("_") !== -1) {
    throw new Error();
  }
  this.username = username;
};

User.prototype.comparePassword = function(password, callback) {
  callback(null, this.password === password);
};

User.prototype.setEmail = function(email) {
  this.email = email;
  this.model.email = email;
};

User.prototype.setFullName = function(fullName) {
  this.fullName = fullName;
  this.model.fullName = fullName;
};

User.prototype.save = function(callback) {
  this.model.save(callback);
};

User.find = function(findParams, callback) {
  UserModel.find(findParams, function(err, users) {
    if (err)
      return callback(err);
    var transformedUsers = [];
    users.forEach(function(user) {
      transformedUsers.push(createObjectFromModel(user));
    });
    callback(null, transformedUsers);
  });
};

// export the class
module.exports = User;
