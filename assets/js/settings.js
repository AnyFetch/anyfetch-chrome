'use strict';

// Persist settings using the `chrome.storage` API
chrome.storage.sync.set({
  hello: true
}, function() {
  console.log('Updated settings.');
});
