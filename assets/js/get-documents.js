'use strict';

require('../../node_modules/zepto/zepto.min.js');
var config = require('./configuration.js');

var documentsEndpoint = '/documents';

/**
 * Request the AnyFetch API for documents matching `query`.
 * Only the first 20 matches will be returned by the API.
 * @param {String} query The search query
 * @param {Function} cb(documents)
 * @return {Array} An array of matching documents
 */
module.exports = function getDocuments(query, successCallback, errorCallback) {
  var url = config.apiUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query
    },
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      if(res && res.data) {
        if(res.data.length > 0) {
          successCallback(res.data);
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
