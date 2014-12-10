"use strict";

var getContextObject = require('./content-helper.js').getContextObject;


/**
 * Return the detected context from the title
 * or false if the regex fails (expected context from a wrong formatted title)
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Boolean|String}
 */
function getFromTitle(tab, site) {
  var matches = tab.title.match(site.context.title);
  if(matches) {
    matches.shift();
    return matches;
  }
  return [];
}

/**
 * Inject content script in page, to get the context from the page's DOM
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Boolean|String}
 */
function getFromDOM(tab, site, cb) {

  // We only call the cb once.
  var called = false;
  function callCb(err, context) {
    if(called) {
      return;
    }
    called = true;
    cb(err, context);
  }

  var requestContext = function(site, cb) {
    chrome.tabs.sendMessage(tab.id, {type: 'contextRequest', site: site}, function(response) {
      var context = getContextObject(response.context);
      cb(null, context);
    });
  };

  // Query the tab to know if we already injected the content script
  chrome.tabs.sendMessage(tab.id, {type: 'ping'}, function(response) {
    if(response && response.type === 'pong' ) {
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

  // Instore a timeout for the page to answer.
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
