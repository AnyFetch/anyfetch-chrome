"use strict";

/**
 * Inject given script if necessary, and execute callback;
 * @param  {int}      tabId The target tab
 * @param  {string}   path  The path of the content script
 * @param  {function} cb    Callback
 */
module.exports.injectScript = function injectScript(tabId, path, cb) {
  // Query the tab to know if we already injected the content script
  chrome.tabs.sendMessage(tabId, {
    type: 'anyfetch::csPing'
  }, function(response) {
    if(response) {
      return cb();
    }
    else {
      chrome.tabs.executeScript(tabId, {
        file: path
      }, function(results) {
        if(results) {
          return cb();
        }
        return cb(new Error('Can\'t inject content script'));
      });
    }
  });
};
