var expect = require('chai').expect;
var should = require('chai').should();
var sinon = require('sinon');

var Emailer = require('../controllers/emailer');

describe('The email controller', function() {
  var emailer = new Emailer();

  it('has a sendVerificationEmail method', function() {
    emailer.should.respondTo('sendVerificationEmail');
  });

  it('creates a verification record when calling sendVerificationEmail', function(done) {
    var mockVerificationRecorder = {
      createVerificationRecord: sinon.stub().callsArgWith(1, null, "http://example.org")
    };
    var mockMailer = {
      send: sinon.stub().callsArgWith(2)
    };

    var emailer = new Emailer(mockVerificationRecorder, mockMailer);
    emailer.sendVerificationEmail({email: "steve"}, function(err) {
      expect(err).to.be.null;
      mockVerificationRecorder.createVerificationRecord.called.should.be.true;
      mockMailer.send.called.should.be.true;
      done();
    });
  });
});
