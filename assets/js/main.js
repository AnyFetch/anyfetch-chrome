'use strict';

var config = require('./configuration.js');
var detectContext = require('./detect-context.js');


// TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
// chrome.tabs.query(null, cb([tabs]));
// TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
// chrome.browserAction.disable(tab.id);

// TODO: when activated, trigger a search and update the badge count
// TODO: render the results list
chrome.tabs.getSelected(null, function(tab) {

  var context = detectContext(tab.url, tab.title);
  if(context) {
    var contextDisplay = document.getElementById('context');
    // TODO: adjust when switching back and forth between tabs
    contextDisplay.innerHTML = context;

    // `tabId` restricts the badge count to a specific tab
    // The badge is reset when the targeted tab is closed
    chrome.browserAction.setBadgeText({
      text: '' + tab.id,
      tabId: tab.id
    });
  }
  else {
    chrome.browserAction.disable(tab.id);
  }
});
