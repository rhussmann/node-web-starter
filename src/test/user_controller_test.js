var expect = require('chai').expect;
var mongoose = require('mongoose');
var should = require('chai').should();
var sinon = require('sinon');

var User = require('../models/users');
var UserController = require('../controllers/user_controller');

// TODO: Should refactor these out to a common location
const MONGOOSE_UNIQUE_KEY_ERROR = 11000;
const HTTP_RESOURCE_CONFLICT = 409;

function getDefaultParameters() {
  return {
    username: "username",
    password: "password",
    password_conf: "password",
    fullName: "Test User",
    email: "user@example.org"
  };
}

describe('The user controller', function() {
  beforeEach(function(done) {
    // TODO: Need to extract this redundancy out to a common testing location
    mongoose.models['User'].find().remove().exec();
    done();
  });

  var userController = new UserController();
  it('creates a user when given valid parameters', function(done) {
    var parameters = getDefaultParameters();

    var req = { body: parameters };
    var res = { redirect: sinon.spy() };

    userController.registerUser(req, res, function(err) {
      expect(err).to.be.null;
      User.find({email: parameters.email}, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.have.length(1);
        var user = results[0];
        user.verified.should.be.false;
        expect(res.redirect.calledWith(301, '/registered'));
        done();
      });
    });
  });

  it('responds with 409 when attempting to create a user with an existing email', function(done) {
    var existingUser = new User();
    var parameters = getDefaultParameters();
    existingUser.setEmail(parameters.email);
    existingUser.save(function(err) {
      expect(err).to.be.null;

      var req = { body: parameters };
      var res = { status: sinon.spy(), render: sinon.spy() };
      userController.registerUser(req, res, function(err) {
        err.should.not.be.null;
        err.code.should.equal(MONGOOSE_UNIQUE_KEY_ERROR);
        res.status.calledWith(HTTP_RESOURCE_CONFLICT).should.be.true;
        done();
      });
    });
  });

  it('redirects renders an error on password mismatch', function(done) {
    var parameters = getDefaultParameters();
    parameters.password_conf = "mismatch";
    var req = { body: parameters };
    var res = { render: sinon.spy() };

    userController.registerUser(req, res, function(err) {
      err.should.not.be.null;
      res.render.calledWith('error').should.be.true;
      done();
    });
  });

  it('saves a hashed password on registration', function(done) {
    var parameters = getDefaultParameters();
    var req = { body: parameters };
    var res = { redirect: sinon.spy() };

    userController.registerUser(req, res, function(err) {
      expect(err).to.be.null;
      User.find({email: parameters.email}, function(err, users) {
        expect(err).to.be.null;
        users.should.have.length(1);
        var user = users[0];
        user.password.should.have.length.greaterThan(1);
        user.password.should.not.equal(parameters.password);
        done();
      });
    });
  });

  it('allows a registered user to login', function(done) {
    var parameters = getDefaultParameters();
    var req = { body: parameters };
    var res = { redirect: sinon.spy() };

    userController.registerUser(req, res, function(err) {
      expect(err).to.be.null;
      User.login(parameters.email, parameters.password, function(err, user) {
        expect(err).to.be.null;
        expect(user).not.to.be.null;
        done();
      });
    });
  });

  it('returns an error when a user attempts login with incorrect password', function(done) {
    var parameters = getDefaultParameters();
    var req = { body: parameters };
    var res = { redirect: sinon.spy() };

    userController.registerUser(req, res, function(err) {
      expect(err).to.be.null;
      User.login(parameters.email, parameters.password.substring(0, parameters.password.length-2), function(err, user) {
        expect(err).to.not.be.null;
        done();
      });
    });
  });
});
