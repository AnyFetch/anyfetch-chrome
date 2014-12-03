'use strict';

var config = require('../config/index.js');
var getContextObject = require('../helpers/content-helper.js').getContextObject;

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
    return matches[1];
  }
  return false;
}

/**
 * Inject content script in page, to get the context from the page's DOM
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Boolean|String}
 */
function getFromDOM(tab, site, cb) {
  var called = false;
  // We only call the cb once.
  function callCb(err, context) {
    if(called) {
      return;
    }
    called = true;
    cb(err, context);
  }

  // Set message listener
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if(sender.tab.id === tab.id) {
      var context = getContextObject(request.context);
      callCb(null, context);
    }
  });

  // Instore a timeout for the page to answer.
  setTimeout(function() {
    callCb(new Error('Cannot get context from content script. Please retry!'));
  }, 5000);

  // Inject script
  chrome.tabs.executeScript(tab.id, {
    code: 'var site = ' + JSON.stringify(site)
  }, function() {
    chrome.tabs.executeScript(tab.id, {
      file: '/dist/advanced-detection.js'
    });
  });
}


/**
 * Return the query string corresponding to the detected context
 * or false if the current website is not supported at this time.
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @return {Boolean|String}
 */
module.exports = function detectContext(tab, cb) {
  var site;

  // Find the tab's site in config.supportedSites
  Object.keys(config.supportedSites).forEach(function(siteName) {
    if(tab.url.match(config.supportedSites[siteName].url)) {
      site = config.supportedSites[siteName];
      site.name = siteName;
    }
  });

  // Not on a supported site, but page action was shown, should never happen
  if(!site) {
    return cb(new Error('Cannot find a supported site'), false);
  }
  // Not on a supported site
  if(!site.context) {
    return cb(new Error('No context for ' + site.name), false);
  }

  if(site.context.title) {
    var context = getFromTitle(tab, site);
    return cb(null, [
      {
        name: context,
        active: true
      }
    ]);
  }
  else if(site.context.dom) {
    return getFromDOM(tab, site, cb);
  }
};
