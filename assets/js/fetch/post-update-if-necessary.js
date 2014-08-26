'use strict';

require('zepto/zepto.min.js');
var config = require('../configuration.js');

var updateEndpoint = '/company/update';

/**
 * Set the lastUpdated date to `date`,
 * stored as a timestamp in `chrome.storage` user settings.
 */
var setLastUpdateDate = function(timestamp) {
  chrome.storage.sync.set({
    lastUpdated: timestamp
  });
};

/**
 * Request the AnyFetch API to update the providers
 * of the user's company.
 */
var postCompanyUpdate = function() {
  var url = config.apiUrl + updateEndpoint;

  $.ajax({
    url: url,
    type: 'POST',
    headers: {
      'Authorization': 'Bearer ' + config.token
    },
    success: function() {
      console.log('Posted company update');
      setLastUpdateDate(Date.now());
    },
    error: function() {
      console.error('Failed to post company update');
    }
  });
};

module.exports = function postUpdateIfNecessary() {
  // Retrieve the last update date from the settings
  chrome.storage.sync.get({
    lastUpdated: 0
  }, function(items) {
    // Post only if enough time has passed since the last update
    var lastUpdated = new Date(items.lastUpdated);
    if((Date.now() - lastUpdated) > config.companyUpdateDelay) {
      postCompanyUpdate();
    }
  });
};
