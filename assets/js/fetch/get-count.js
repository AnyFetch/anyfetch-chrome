'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

var documentsEndpoint = '/documents';

/**
 * Request the AnyFetch API for the number of documents matching `query`.
 * @param {String} query The search query
 * @param {Function} cb(err, count)
 *   count Number of documents matching `query`
 */
module.exports = function getCount(query, cb) {
  var url = config.apiUrl + documentsEndpoint;

  $.ajax({
    url: url,
    data: {
      search: query,
      limit: 0,
      //fields: 'count'
      // TODO: Enable this when active on production
    },
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      console.log(res);
      if(res && ('count' in res)) {
        return cb(null, res.count);
      }
      cb(new Error(res.responseJSON || res.responseText));
    },
    error: function(res) {
      cb(new Error(res.responseJSON || res.responseText));
    }
  });
};
