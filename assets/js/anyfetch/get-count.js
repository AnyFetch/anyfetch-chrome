'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Caching the last query and the last response to avoid calling the api multiple times with the same query
 */
var lastQuery;
var lastResponse;

/**
 * Request the AnyFetch API for the number of documents matching `query`.
 * @param {String} query The search query
 * @param {Function} cb(err, count)
 *   count Number of documents matching `query`
 */
module.exports = function getCount(query, cb) {
  if(query === lastQuery) {
    return cb(null, lastResponse && lastResponse.count);
  }
  else {
    var options = {
      url: config.store.apiUrl + '/documents',
      data: {
        search: query,
        limit: 0,
        fields: 'count'
      },
    };

    call.httpRequest(options, function(err, body) {
      if(!err) {
        lastQuery = query;
        lastResponse = body;
      }
      cb(err, body && body.count);
    });
  }
};
