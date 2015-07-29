function VerificationRecorder(baseUrl) {
  this.baseUrl = baseUrl;
}
VerificationRecorder.prototype.createVerificationRecord =  function(user, callback) {
    callback(null, this.baseUrl + "/verify?verifyToken=" + user.model._id);
};

module.exports = VerificationRecorder;
