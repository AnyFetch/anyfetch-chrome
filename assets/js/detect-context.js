'use strict';

var config = require('./configuration.js');

/**
 * Return the query string corresponding to the detected context
 * or false if the current website is not supported at this time.
 * @param {String} url URL of the current tab
 * @param {String} title Title of the current tab
 * @return {Boolean|String}
 */
module.exports = function detectContext(url, title) {
  var site;
  for(var siteName in config.supportedSites) {
    site = config.supportedSites[siteName];

    if(url.match(site.url)) {
      // We're on a supported site, let's find the query string
      var matches = title.match(site.context);
      if(matches) {
        return matches[1];
      }
    }
  }

  // No supported site detected
  return false;
};
