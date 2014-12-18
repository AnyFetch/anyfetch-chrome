'use strict';

var request = require('browser-request');
var config = require('../config/index.js');

module.exports = function call(options, cb) {
  if(!config.token) {
    return cb(new Error('No token in config object while trying to call AnyFetch API'));
  }
  options.headers = {
    'Authorization': 'Bearer ' + config.token
  };
  options.json = true;
  request(options, function(err, res, body) {
    if(res.status >= 400) {
      cb(new Error(body.code + ': ' + body.message));
    }
    cb(err, body);
  });
};
