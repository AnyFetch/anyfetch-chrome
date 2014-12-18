'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Request the AnyFetch API for the api status
 * @param {Function} cb(err)
 */
module.exports = function getStatus(query, cb) {
  var options = {
    url: config.apiUrl + '/status',
  };

  call(options, cb);
};
