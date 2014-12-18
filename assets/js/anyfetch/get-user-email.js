'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Request the AnyFetch API for the user email, by calling the root endpoint
 * @param {Function} cb(err, email)
 */
module.exports = function getUserEmail(cb) {
  var options = {
    url: config.apiUrl + '/',
  };

  call(options, function(err, body) {
    cb(err, body && body.user_email);
  });
};
