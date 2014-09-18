'use strict';

var config = require('./configuration.js');

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
var checkForSupportedSite = function checkForSupportedSite(tabId, changeInfo, tab) {
  console.log(new Date() + ': Tab updated event fired');
  var site;
  for(var siteName in config.supportedSites) {
    site = config.supportedSites[siteName];
    if(tab.url.match(site.url)) {
      console.log(new Date() + ': Shown pageAction for ' + siteName);
      chrome.pageAction.show(tabId);
      return;
    }
  }
  console.log(new Date() + ': Hidden pageAction');
  chrome.pageAction.hide(tabId);
};

// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function(details) {
  console.log(new Date() + ': Updating rules');

  if(details.reason === "install") {
    // open first run page on install
    chrome.tabs.create({url: 'views/first-run.html'});
  }

  // listen for tabs url changes
  chrome.tabs.onUpdated.addListener(checkForSupportedSite);
});
