require('chai').should();

var expect = require('chai').expect;
var mongoose = require('mongoose');
var User = require('../models/users');

var emptyCollection = function(done) {
  mongoose.models['User'].find().remove().exec();
  done();
};

describe('A user object', function() {
  before(emptyCollection);
  var thing = new User();
  it('has a username property', function() {
    thing.should.contain.key('username');
  });
  it('has a fullName property', function() {
    thing.should.contain.key('fullName');
  });
  it('has an email property', function() {
    thing.should.contain.key('email');
  });
  it('does not allow usernames with underscores', function() {
    expect(function(){thing.setUsername("bad_user");}).to.throw(Error);
  });
  it('has a verified property', function() {
    thing.should.contain.key('verified');
  });
  it('allows a username without underscores', function() {
    expect(function(){thing.setUsername("aUsername");}).to.not.throw(Error);
  });
  it('has a comparePassword method', function() {
    thing.should.respondTo('comparePassword');
  });
  it('returns false when an incorrect password is checked', function() {
    thing.password = 'password';
    thing.comparePassword('incorrect password', function(err, matches) {
      matches.should.be.false;
    });
  });
  it('returns true when a correct password is checked', function() {
    thing.password = 'password';
    thing.comparePassword('password', function(err, matches) {
      matches.should.be.true;
    });
  });
  it('finds a saved user', function(done) {
    before(emptyCollection);
    thing.setEmail("user@example.org");
    thing.save(function(err) {
      expect(err).to.be.null;
      User.find({email: "user@example.org"}, function(err, users) {
        expect(err).to.be.null;
        users.should.have.length(1);
        done();
      });
    });
  });
  it('throws a validation error when attempting to duplicate an email address', function(done) {
    before(emptyCollection);
    var newUser = new User();
    newUser.setEmail("bart@example.org");
    newUser.save(function(err) {
      expect(err).to.be.null;
      var duplicateUser = new User();
      duplicateUser.setEmail("bart@example.org");
      duplicateUser.save(function(err) {
        expect(err).to.be.not.null;
        done();
      });
    });
  });
});
