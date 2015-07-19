var User = require('../models/users');

function UserController() {}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

UserController.prototype.registerUser = function(req, res, callback) {
  var newUser = new User();
  newUser.setEmail(req.body.email);
  newUser.setFullName(req.body.fullName);
  newUser.save(function(err) {
    if(err) {
      res.render('error');
    }

    if(isFunction(callback)) {
      callback(null);
    }
  });
};

module.exports = UserController;
