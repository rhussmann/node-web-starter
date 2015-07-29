var config = {};

config.app_port = process.env.PORT || 3000;
config.app_root_url = 'http://localhost:' + config.app_port;

config.gmail_user = process.env.NODEMAILER_USER;
config.gmail_pass = process.env.NODEMAILER_PASS;

config.mongo_url = 'mongodb://localhost/ricky-testing';

module.exports = config;
