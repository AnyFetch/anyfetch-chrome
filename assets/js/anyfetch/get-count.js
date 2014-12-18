'use strict';

var config = require('../config/index.js');
var call = require('./call.js');


/**
 * Request the AnyFetch API for the number of documents matching `query`.
 * @param {String} query The search query
 * @param {Function} cb(err, count)
 *   count Number of documents matching `query`
 */
module.exports = function getCount(query, cb) {
  var options = {
    url: config.apiUrl + '/documents',
    data: {
      search: query,
      limit: 0,
      fields: 'count'
    },
  };

  call(options, function(err, body) {
    cb(err, body && body.count);
  });
};
