function Emailer(verificationRecorder, mailer) {
  this.verificationRecoder = verificationRecorder;
  this.mailer = mailer;
}

Emailer.prototype.sendVerificationEmail = function(user, callback) {
  var that = this;
  that.verificationRecoder.createVerificationRecord(user, function(err, link) {
    if (err) {
      return callback(new Error(err));
    }
    that.mailer.send(user.email, link, function(err) {
      if(err) {
        return callback(new Error(err));
      }
      callback(null);
    });
  });
};

module.exports = Emailer;
