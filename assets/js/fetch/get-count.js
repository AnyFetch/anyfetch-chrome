'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

var documentsEndpoint = '/documents';

/**
 * Request the AnyFetch API for number of documents matching `query`.
 * @param {String} query The search query
 * @param {Function} cb(err, count)
 *   documents An array of matching documents
 */
module.exports = function getCount(query, cb) {
  var url = config.apiUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query,
      limit: 0,
    },
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      console.log(res);
      if(res && ('count' in res)) {
        return cb(null, res.count);
      }
      cb(res.responseJSON || res.responseText);
    },
    error: function(res) {
      cb(res.responseJSON || res.responseText);
    }
  });
};
