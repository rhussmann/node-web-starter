var config = {};

config.app_port = process.env.PORT || 3000;
config.app_root_url = 'http://localhost:' + config.app_port;

config.mongo_url = 'mongodb://localhost/node-web-starter-test';

module.exports = config;
