var verificationRecoder = {
  createVerificationRecord: function(user, callback) {
    callback(null, "http://localhost:3000/verify?verifyToken=" + user.model._id);
  }
};

module.exports = verificationRecoder;
