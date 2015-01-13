'use strict';

var config = require('../config/index.js');
var saveUserData = require('../anyfetch/save-user-data.js');

/*
 * Start oauth flow with remote server
 * config must be loaded
 */
module.exports = function(cb) {
  if(!cb) {
    cb = function() {};
  }
  var success = false;

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request.type === 'anyfetch::oauthResponse') {
        success = true;
        config.token = request.token;
        sendResponse();
        chrome.tabs.remove(sender.tab && sender.tab.id);
        chrome.storage.sync.set({token: request.token}, cb);
        saveUserData(function(err) {
          if(err) {
            console.error(err);
          }
        });
      }
    }
  );

  chrome.windows.create({
    url: config.serverUrl + '/init/connect',
    type: 'popup',
    width: 800,
    height: 800
  }, function(window) {
    chrome.windows.onRemoved.addListener(function(id) {
      if(window.id === id && !success) {
        cb(new Error('Canceled by user'));
      }
    });
  });
};
