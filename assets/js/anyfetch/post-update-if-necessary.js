'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

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
 * of the user.
 */
var postUserUpdate = function postUserUpdate(cb) {
  var options = {
    url: config.apiUrl + '/user/update',
    type: 'POST'
  };

  call(options, cb);
};

module.exports = function postUpdateIfNecessary() {
  // Retrieve the last update date from the settings
  chrome.storage.sync.get({
    lastUpdated: 0
  }, function(items) {
    // Post only if enough time has passed since the last update
    var lastUpdated = new Date(items.lastUpdated);
    if((Date.now() - lastUpdated) > config.userUpdateDelay) {
      postUserUpdate(function(err) {
        if(err) {
          console.error('Failed to post user update');
          // Set last update even if errored. This prevent spam.
          // Retry in (config.userUpdateDelay / 4) seconds
          setLastUpdateDate(Date.now() - (config.userUpdateDelay - config.userUpdateDelay / 4));
          return;
        }
        console.log('Posted user update');
        setLastUpdateDate(Date.now());
      });
    }
  });
};
