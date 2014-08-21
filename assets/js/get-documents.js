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
module.exports = function getDocuments(query, cb) {
  var url = config.anyFetchUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query
    },
    headers: {
      'Authorization': 'Bearer ' + config.anyFetchToken
    },
    success: function(res) {
      cb(res.data);
    },
    error: function(err, status, res) {
      console.log('ERR', arguments);
    }
  });
};
