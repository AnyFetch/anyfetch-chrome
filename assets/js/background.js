'use strict';

console.log('Updating rules');

/**
 * @see https://developer.chrome.com/extensions/declarativeContent#type-PageStateMatcher
 */

// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function() {
  // Update the activation rule
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            // TODO
            pageUrl: { urlContains: 'github' },
          })
        ],
        // Action: show the PageAction
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
