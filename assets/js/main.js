'use strict';

var detectContext = require('./detect-context.js');

// TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
// chrome.tabs.query(null, cb([tabs]));
// TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
// chrome.browserAction.disable(tab.id);

// TODO: when activated, trigger a search and update the badge count
// TODO: render the results list
chrome.tabs.getSelected(null, function(tab) {
  var contextDisplay = document.getElementById('context');
  var errorDisplay = document.getElementById('error');

  var context = detectContext(tab.url, tab.title);
  if(context) {
    // TODO: adjust when switching back and forth between tabs
    contextDisplay.innerHTML = context;
    errorDisplay.innerHTML = '';

    // `tabId` restricts the badge count to a specific tab
    // The badge is reset when the targeted tab is closed
    chrome.browserAction.setBadgeText({
      text: '' + tab.id,
      tabId: tab.id
    });
  }
  else {
    contextDisplay.innerHTML = '';
    errorDisplay.innerHTML = 'No context detected';
    //chrome.browserAction.disable(tab.id);
  }
});
