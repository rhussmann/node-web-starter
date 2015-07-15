var expect = require('chai').expect;
var should = require('chai').should();
var User = require('../models/users');

describe('A user object', function() {
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
});
