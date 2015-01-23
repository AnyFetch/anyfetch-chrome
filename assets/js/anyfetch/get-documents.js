'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Request the AnyFetch API for documents matching `query`.
 * Only the first config.resultsCountLimit matches will be returned by the API.
 * @param {String} query The search query
 * @param {Function} cb(err, documents, totalCount)
 *   documents An array of matching documents
 *   totalCount The total number of matches (may be superior to `documents.length`)
 */
module.exports = function getDocuments(query, cb) {
  var options = {
    url: config.apiUrl + '/documents',
    data: {
      search: query,
      limit: config.resultsCountLimit,
      sort: '-modificationDate',
      render_templates: true
    },
  };

  call.httpRequest(options, function(err, body) {
    cb(err, body && body.data, body && body.count);
  });
};
