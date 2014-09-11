'use strict';

require('zepto/zepto.min.js');
var config = require('../configuration.js');

/**
 * Request the AnyFetch API for the users' connected providers
 * @param {Function} cb(err)
 */
module.exports = function getStatus(cb) {
  var url = config.apiUrl + '/providers';

  $.ajax({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      cb(null, res);
    },
    error: function(res) {
      cb(res);
    }
  });
};
