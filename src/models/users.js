var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const USER_PASS_SALT_LENGTH = 10;

var userSchema = new Schema({
  email:  {
    type: String,
    lowercase: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  fullName: String,
  password: String,
  verified: Boolean
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
  this.model.verified = false;
}

function createObjectFromModel(model) {
  var newUser = new User();
  newUser.model = model;
  newUser.fullName = model.fullName;
  newUser.email = model.email;
  newUser.password = model.password;
  newUser.verified = model.verified || newUser.verified;
  return newUser;
}

User.prototype.setUsername = function(username) {
  if (username.indexOf("_") !== -1) {
    throw new Error();
  }
  this.username = username;
};

User.prototype.verify = function() {
  this.verified = true;
  this.model.verified = true;
};

User.prototype.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

User.prototype.setEmail = function(email) {
  this.email = email;
  this.model.email = email;
};

User.prototype.setFullName = function(fullName) {
  this.fullName = fullName;
  this.model.fullName = fullName;
};

User.prototype.setPassword = function(password) {
  this.password = password;
  this.model.password = password;
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

User.generateHash = function(password, callback) {
  bcrypt.genSalt(USER_PASS_SALT_LENGTH, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if(err)
        callback(err);
      callback(null, hash);
    });
  });
};

User.login = function(email, password, callback) {
  User.find({email: email}, function(err, users) {
    if(err)
      return callback(err);

    if(users.length > 1) {
        var error = new Error("Ambiguous users: found " +
          users.length + " users with email " + email);
        return callback(error);
      }

    if(users.length == 0) {
      var error = new Error("No users found with email " + email);
      return callback(error);
    }

    var user = users[0];
    user.comparePassword(password, function(err, success) {
      if(err)
        return callback(err);

      if(!success)
        return callback(new Error("Login failed: invalid password"));

      callback(null, user);
    });
  });
};

// export the class
module.exports = User;
