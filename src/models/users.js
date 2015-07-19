var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:  {
    type: String,
    index: {
      unique: true,
      dropDups: true
    }
  }
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

User.prototype.save = function(callback) {
  this.model.save(callback);
};

User.find = function(findParams, callback) {
  UserModel.find(findParams, callback);
};

// export the class
module.exports = User;
