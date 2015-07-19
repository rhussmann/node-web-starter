var nodemailer = require('nodemailer');

function Mailer () {
  this.transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
}

Mailer.prototype.send = function(emailAddress, contents, callback) {
  var that = this;
  var mailOptions = {
    to: emailAddress,
    subject: "Please verify your christmas account email address",
    text: contents
  };
  that.transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
      console.log(err);
      return callback(new Error(err));
    }
    console.log("Mail sent successfully: " + info.response);
    return callback(null);
  });
};

module.exports = Mailer;
