'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

var documentsEndpoint = '/documents';

/**
 * Request the AnyFetch API for documents matching `query`.
 * Only the first 20 matches will be returned by the API.
 * @param {String} query The search query
 * @param {Function} cb(err, documents, totalCount)
 *   documents An array of matching documents
 *   totalCount The total number of matches (may be superior to `documents.length`)
 */
module.exports = function getDocuments(query, cb) {
  var url = config.apiUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query,
      limit: config.resultsCountLimit,
      sort: '-modificationDate'
    },
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      if(res && res.data) {
        return cb(null, res.data, res.count);
      }
      cb(res.responseJSON || res.responseText);
    },
    error: function(res) {
      cb(res.responseJSON || res.responseText);
    }
  });
};
