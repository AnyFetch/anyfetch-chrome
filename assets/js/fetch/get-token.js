'use strict';

require('zepto/zepto.min.js');
var config = require('../configuration.js');

/**
 * Request the AnyFetch API for the user's token
 * @param {String} email
 * @param {String} password
 * @param {Function} successCallback(token)
 *   token The user token
 * @param {Function} errorCallback(err)
 */
module.exports = function getToken(email, password, cb) {
  var url = config.apiUrl + '/token';

  $.ajax({
    url: url,
    headers: {
      'Authorization': 'Basic ' + btoa(email + ":" + password)
    },
    success: function(res) {
      cb(null, res.token);
    },
    error: function(res) {
      cb(res);
    }
  });
};
