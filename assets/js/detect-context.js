'use strict';

var config = require('./configuration.js');
var async = require('async');

/**
 * Return the query string corresponding to the detected context
 * or false if the current website is not supported at this time.
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @return {Boolean|String}
 */
module.exports = function detectContext(tab, cb) {
  var context = false;
  async.each(Object.keys(config.supportedSites), function(siteName, cb) {
    var site = config.supportedSites[siteName];
    if(tab.url.match(site.url) && site.context) {
      // We're on a supported site
      if(site.context.title) {
        var matches = tab.title.match(site.context.title);
        if(matches) {
          context = matches[1];
          return cb(null);
        }
        cb();
      }
      else if(site.context.dom) {
        // Search advanced context
        chrome.runtime.onMessage.addListener(function(request, sender) {
          // Set message listener
          if(sender.tab.id === tab.id) {
            context = request.context.join(' OR ');
          }
          return cb(null);
        });

        chrome.tabs.executeScript(tab.id, {
          file: '/dist/advanced-detection.js'
        });
      }
      else {
        cb(null);
      }
    }
    else {
      cb(null);
    }
  }, function(err) {
    cb(err, context);
  });
};
