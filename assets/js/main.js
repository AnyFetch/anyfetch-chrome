console.log('Hello Chrome');

// TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
// chrome.tabs.query(null, cb([tabs]));
// TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
// chrome.browserAction.disable(tab.id);

// TODO: when activated, trigger a search and update the badge count
// TODO: render the results list
var tabId = chrome.tabs.getSelected(null, function(tab) {
  // `tabId` restricts the badge count to a specific tab
  // The badge is reset when the targeted tab is closed
  chrome.browserAction.setBadgeText({
    text: '' + tab.id,
    tabId: tabId
  });
});
