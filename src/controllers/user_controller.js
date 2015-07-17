function UserController() {}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

UserController.prototype.registerUser = function(req, res, callback) {
  res.sendStatus(500);
  if(isFunction(callback)) {
    callback(null);
  }
};

module.exports = UserController;
