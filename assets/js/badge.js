'use strict';

/**
 * Set the badge count for the tab with given `tabId`
 */
module.exports.setCount = function(count, tabId) {
  chrome.browserAction.setBadgeText({
    text: '' + count,
    tabId: tabId
  });
};
