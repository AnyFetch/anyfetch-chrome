'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');
var call = require('./call.js');


/**
 * Caching the last query and le tast response to avoid calling multiple times api with the same query.
 */
var lastQuery;
var lastResponse;

/**
 * Request the AnyFetch API for documents matching `query`.
 * Only the first config.resultsCountLimit matches will be returned by the API.
 * @param {String} query The search query
 * @param {Function} cb(err, documents, totalCount)
 *   documents An array of matching documents
 *   totalCount The total number of matches (may be superior to `documents.length`)
 */
module.exports = function getDocuments(query, cb) {
  if(query === lastQuery) {
    cb(null, lastResponse && lastResponse.data, lastResponse && lastResponse.count)
  }
  else {
    var options = {
      url: config.apiUrl + '/documents',
      data: {
        search: query,
        limit: config.resultsCountLimit,
        sort: '-modificationDate',
        render_templates: true
      },
    };

    call(options, function(err, body) {
      if(!err) {
        lastQuery = query;
        lastResponse = body;
      }
      cb(err, body && body.data, body && body.count);
    });
  }
};
