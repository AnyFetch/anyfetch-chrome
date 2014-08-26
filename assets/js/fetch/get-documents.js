'use strict';

require('zepto/zepto.min.js');
var config = require('../configuration.js');

var documentsEndpoint = '/documents';

/**
 * Request the AnyFetch API for documents matching `query`.
 * Only the first 20 matches will be returned by the API.
 * @param {String} query The search query
 * @param {Function} successCallback(documents, totalCount)
 *   documents An array of matching documents
 *   totalCount The total number of matches (may be superior to `documents.length`)
 * @param {Function} errorCallback(err)
 */
module.exports = function getDocuments(query, successCallback, errorCallback) {
  var url = config.apiUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query,
      limit: config.resultsCountLimit,
      sort: '-creationDate'
    },
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      if(res && res.data) {
        if(res.data.length > 0) {
          successCallback(res.data, res.count);
        }
        else {
          errorCallback('No results for query "' + query + '"');
        }
      }
    },
    error: function(res) {
      errorCallback(res.responseJSON || res.responseText);
    }
  });
};
