var expect = require('chai').expect;
var should = require('chai').should();
var sinon = require('sinon');

var UserController = require('../controllers/user_controller');

function getDefaultParameters() {
  return {
    username: "username",
    password: "password",
    password_conf: "password",
    name: "Test User",
    email: "user@example.org"
  };
}

describe('The user controller', function() {
  var userController = new UserController();
  it('validates required parameters', function(done) {
    var parameters = getDefaultParameters();
    parameters.username = "";

    var req = {};
    req.body = parameters;
    var res = {};
    res.render = sinon.spy();

    userController.registerUser(req, res, function(err) {
      expect(res.render.calledWith('error')).to.be.true;
      done();
    });
  });
});
