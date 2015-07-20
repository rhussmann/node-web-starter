var User = require('../models/users');

function UserController() {}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

UserController.prototype.registerUser = function(req, res, callback) {
  if (req.body.password !== req.body.password_conf) {
    res.render('error');
    return callback(new Error("Password does not match confirmation."));
  }

  var newUser = new User();
  newUser.setEmail(req.body.email);
  newUser.setFullName(req.body.fullName);
  User.generateHash(req.body.password, function(err, hash) {
    if (err) {
      res.status(500);
      res.render('error');
      return callback(err);
    }

    newUser.setPassword(hash);
    newUser.save(function(err) {
      if(err) {
        res.status(409);
        res.render('error');
      } else {
        res.redirect(301, '/registered');
      }

      if(isFunction(callback)) {
        callback(err);
      }
    });
  });
};

module.exports = UserController;
