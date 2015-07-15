// Constructor
function User() {
  // always initialize all instance properties
  this.username = "";
  this.fullName = "";
  this.password = "";
  this.email = "";
  this.verified = false;
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

// export the class
module.exports = User;
