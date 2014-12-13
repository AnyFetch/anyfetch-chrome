'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

var rootEndpoint = '/';

/**
 * Request the AnyFetch API for the user email, by calling the root endpoint
 * @param {Function} cb(err, email)
 */
module.exports = function getUserEmail(cb) {
  var url = config.apiUrl + rootEndpoint;

  $.ajax({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      if(res && ('user_email' in res)) {
        return cb(null, res.user_email);
      }
      cb(new Error(res.responseJSON || res.responseText));
    },
    error: function(res) {
      cb(new Error(res.responseJSON || res.responseText));
    }
  });
};

