'use strict';

require('../../node_modules/zepto/zepto.min.js');
var config = require('./configuration.js');

var updateEndpoint = '/company/update';

/**
 * Request the AnyFetch API to update the providers
 * of the user's company.
 * @TODO Use the hydrater's document count to display a "still hydrating" warning message
 */
module.exports = function postCompanyUpdate() {
  var url = config.apiUrl + updateEndpoint;

  $.ajax({
    url: url,
    type: 'POST',
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function(res) {
      console.log('Posted company update');
    },
    error: function(res) {
      console.error('Failed to post company update');
    }
  });
};
