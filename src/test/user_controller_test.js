var expect = require('chai').expect;
var mongoose = require('mongoose');
var should = require('chai').should();
var sinon = require('sinon');

var Users = require('../models/users');
var UserController = require('../controllers/user_controller');

function getDefaultParameters() {
  return {
    username: "username",
    password: "password",
    password_conf: "password",
    fullName: "Test User",
    email: "user@example.org",
  };
}

describe('The user controller', function() {
  before(function(done) {
    // TODO: Need to extract this redundancy out to a common testing location
    mongoose.models['User'].find().remove().exec();
    done();
  });
  var userController = new UserController();
  it('creates a user when given valid parameters', function(done) {
    var parameters = getDefaultParameters();

    var req = {};
    req.body = parameters;
    var res = {};
    res.render = sinon.spy();

    userController.registerUser(req, res, function(err) {
      expect(err).to.be.null;
      Users.find({email: parameters.email}, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.have.length(1);
        var user = results[0];
        user.verified.should.be.false;
        done();
      });
    });
  });
});
