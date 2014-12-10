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
    return matches;
  }
  return [];
}

/**
 * Inject content script in page, to get the context from the page's DOM
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 */
function getFromDOM(tab, site, cb) {

  var callCb = function(err, context) {
    // We only call the cb once.
    callCb = function() {};
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
    if(response && response.type === 'anyfetch::pong' ) {
      requestContext(site, callCb);
    }
    else {
      chrome.tabs.executeScript(tab.id, {
        file: '/dist/advanced-detection.js'
      }, function() {
        requestContext(site, callCb);
      });
    }
  });

  // Add a timeout waiting for the page's answer
  setTimeout(function() {
    callCb(new Error('Cannot get context from content script. Please retry!'));
  }, 5000);
}

module.exports = function detectContext(tab, site, cb) {
  if(site.context.title) {
    var context = getFromTitle(tab, site);
    return cb(null, getContextObject(context));
  }
  else if(site.context.dom) {
    return getFromDOM(tab, site, cb);
  }
};
