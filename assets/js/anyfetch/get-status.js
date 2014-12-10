'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

/**
 * Request the AnyFetch API for the api status
 * @param {Function} cb(err)
 */
module.exports = function getStatus(cb) {
  var url = config.apiUrl + '/status';

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
