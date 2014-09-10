'use strict';

var config = require('./configuration.js');

/**
 *
 * @return {Array} An array of PageStateMatcher
 * @see https://developer.chrome.com/extensions/declarativeContent#type-PageStateMatcher
 * @see https://developer.chrome.com/extensions/events#type-UrlFilter
 */
var getPageMatchingRules = function(descriptors) {
  var matchers = [];

  for(var siteName in descriptors) {
    var page = descriptors[siteName];

    matchers.push(new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { urlMatches: page.url },
    }));
  }

  return matchers;
};

// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Updating rules');

  if(details.reason === "install") {
    // open first run page on install
    chrome.tabs.create({url: 'views/first-run.html'});
  }

  // Update the activation rule
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: getPageMatchingRules(config.supportedSites),
        // Action: show the PageAction
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
