'use strict';

var config = require('./configuration.js');

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
function checkForSupportedSite(tab) {
  var site;
  for(var siteName in config.supportedSites) {
    site = config.supportedSites[siteName];
    if(tab.url.match(site.url)) {
      chrome.pageAction.show(tab.id);
      return;
    }
  }
  chrome.pageAction.hide(tab.id);
}

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
function handleOnUpdated(tabId, changeInfo, tab) {
  if(changeInfo.status === 'loading' && tab.id && tab.url) {
    checkForSupportedSite(tab);
  }
}


// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function(details) {
  console.log(new Date() + ': Updating rules');

  if(details.reason === "install") {
    // open first run page on install
    chrome.tabs.create({url: 'views/first-run.html'});
  }
});

// listen for tabs url changes
chrome.tabs.onUpdated.addListener(handleOnUpdated);
