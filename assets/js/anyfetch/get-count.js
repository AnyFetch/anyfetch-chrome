'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Caching the last query and le tast response to avoid calling multiple times api with the same query.
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
    console.log("Reuse cached query");
    cb(null, lastResponse && lastResponse.count);
  }
  else {
    console.log("NO Reuse cached query: old query=", lastQuery);
    var options = {
      url: config.apiUrl + '/documents',
      data: {
        search: query,
        limit: 0,
        fields: 'count'
      },
    };

    call(options, function(err, body) {
      if(!err) {
        lastQuery = query;
        lastResponse = body;
      }
      cb(err, body && body.count);
    });
  }
};
