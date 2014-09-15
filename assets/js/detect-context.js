'use strict';

var config = require('./configuration.js');

/**
 * Return the query string corresponding to the detected context
 * or false if the current website is not supported at this time.
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @return {Boolean|String}
 */
module.exports = function detectContext(tab, cb) {
  var site;
  var match = false;
  for(var siteName in config.supportedSites) {
    site = config.supportedSites[siteName];

    if(tab.url.match(site.url)) {
      match = true;
      if(site.context && site.context.title) {
        // We're on a supported site, let's find the query string
        var matches = tab.title.match(site.context.title);
        if(matches) {
          return cb(null, matches[1]);
        }
      }

      // Search advanced context
      // Set message listener
      chrome.runtime.onMessage.addListener(function(request, sender) {
        if(sender.tab.id === tab.id) {
          return cb(null, request.context);
        }
        return cb(null, false);
      });

      chrome.tabs.executeScript(tab.id, {
        file: '/dist/advanced-detection.js'
      });
    }
  }

  // No supported site detected
  if(!match) {
    cb(null, false);
  }
};
