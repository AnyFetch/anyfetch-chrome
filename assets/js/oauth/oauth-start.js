'use strict';

var config = require('../config/index.js');

/*
 * Start oauth flow with remote server
 */
module.exports = function(cb, url) {
  if(!cb) {
    cb = function() {};
  }
  var success = false;

  chrome.windows.create({
    url: config.store.serverUrl + url,
    type: 'popup',
    width: 800,
    height: 800
  }, function(window) {
    chrome.windows.onRemoved.addListener(function(id) {
      if(window.id === id && !success) {
        cb(new Error('Canceled by user'));
      }
    });

    // When the chrome-server redirects us on http://chrome.anyfetch.com we can grab the token and destroy the window
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if(window.tabs[0].id === tab.id && changeInfo.url && changeInfo.url.substring(0, changeInfo.url.lastIndexOf('/')) === 'http://chrome.anyfetch.com') {
        var params = changeInfo.url.substring(changeInfo.url.lastIndexOf('=') + 1, changeInfo.url.length);
        config.store.loadSettings(function() {
          success = true;
          //Closing the window after setting success to true to trigger the listener set before
          chrome.windows.remove(window.id);
          config.store.token = params;
          cb(null);
        });
      }
    });
  });
};
