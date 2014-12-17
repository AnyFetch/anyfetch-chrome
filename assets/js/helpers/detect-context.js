"use strict";

var getContextObject = require('./content-helper.js').getContextObject;


/**
 * Return the detected elements from the title or an empty array
 * if the regex fails (expected context from a badly formatted title)
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Array}
 */
function getFromTitle(tab, site) {
  var matches = tab.title.match(site.context.title);
  if(matches && matches.length > 1) {
    // The first element is the input. We return the captured elements
    // from the string (parenthesis in the regexp)
    matches.shift();
    return getContextObject(matches);
  }
  return [];
}

/**
 * Inject content script in page, to get the context from the page's DOM
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 */
function getFromDOM(tab, site, cb) {
  // Add a timeout waiting for the page's answer
  var timeout = setTimeout(function() {
    callCb(new Error('Cannot get context from content script. Please retry!'));
  }, 5000);

  var callCb = function(err, context) {
    clearTimeout(timeout);
    cb(err, context);
  };

  var requestContext = function(site, cb) {
    chrome.tabs.sendMessage(tab.id, {type: 'anyfetch::contextRequest', site: site}, function(response) {
      var context = getContextObject(response.context);
      cb(null, context);
    });
  };

  // Query the tab to know if we already injected the content script
  chrome.tabs.sendMessage(tab.id, {type: 'anyfetch::ping'}, function(response) {
    if(response && response.type === 'anyfetch::pong') {
      requestContext(site, callCb);
    }
    else {
      chrome.tabs.executeScript(tab.id, {
        file: '/js/advanced-detection.js'
      }, function(results) {
        if(results) {
          return requestContext(site, callCb);
        }
        console.error('Failed to inject content script');
      });
    }
  });
}

/**
 * Detect the context from a target tab.
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Array} An array of Objects of the following format: {active: true, name: "the context"}
 *                 This array should not contain any duplicated item.
 *                 The `active` key is used to know if the user blacklisted this context.
 *                 This is initialized to true, and currently the filtering is done outside this function.
 */
module.exports = function detectContext(tab, site, cb) {
  // We check the site's context detection method.
  // TODO: Mix the results of the two methods.
  if(site.context.title) {
    return cb(null, getFromTitle(tab, site));
  }
  else if(site.context.dom) {
    return getFromDOM(tab, site, cb);
  }
};
