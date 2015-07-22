var mongoose = require('mongoose');
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

UserController.prototype.login = function(req, res, callback) {
  User.login(req.body.email, req.body.password, function(err, user) {
    if (err) {
      res.render('error');
      return callback(err);
    }

    if (!user.verified) {
      res.redirect(301, '/account_not_verified');
      return callback(new Error("Account for user not verified: " + user.email));
    }

    res.redirect(301, '/home');
    callback(null);
  });
};

UserController.prototype.verifyUser = function(verificationToken, callback) {
  User.find({_id: mongoose.Types.ObjectId(verificationToken)}, function(err, users) {
    if(err)
      return callback(err);

    if(users.length > 1) {
      return callback(new Error("Ambiguous user for verification token " + verificationToken));
    }

    if(users.length === 0 ) {
      return callback(new Error("No user found for verification token " + verificationToken));
    }

    var user = users[0];
    user.verify();
    user.save(function(err) {
      callback(err);
    });
  });
};

module.exports = UserController;
