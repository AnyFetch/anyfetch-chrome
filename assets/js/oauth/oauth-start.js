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

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.type === 'anyfetch::frontLoginSuccessful') {
          success = true;
          sendResponse();
          if(sender.tab) {
            chrome.tabs.remove(sender.tab.id);
          }
          cb(null);
        }
      }
    );
  });
};
