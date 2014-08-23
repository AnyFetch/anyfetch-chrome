'use strict';

var config = require('./configuration.js');

// We need to wait on `chrome.storage` to load the user's settings
// before doing anything else
config.loadUserSettings(function() {
  var errors = require('./errors.js');
  var postUpdateIfNecessary = require('./post-update-if-necessary.js');
  var detectContext = require('./detect-context.js');
  var getDocuments = require('./get-documents.js');
  var view = require('./view.js');

  // TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
  // chrome.tabs.query(null, cb([tabs]));
  // TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
  // chrome.browserAction.disable(tab.id);
  // TODO: look-ahead (do not wait to be clicked to fetch results)
  // TODO: i18n

  $(document).ready(function() {
    if(!config.token) {
      errors.show('Please <a href="options.html" target="_blank">setup your AnyFetch account</a> to start using AnyFetch.');
      return;
    }

    // ----- Post update
    postUpdateIfNecessary();

    chrome.tabs.getSelected(null, function(tab) {
      // ----- Detect context
      var context = detectContext(tab.url, tab.title);
      if(context) {
        // TODO: adjust view when switching back and forth between tabs

        // ----- Retrieve documents
        getDocuments(context, function success(documents, totalCount) {
          // ----- Update badge count
          // `tabId` restricts the badge count to a specific tab
          // The badge is reset when the targeted tab is closed
          chrome.browserAction.setBadgeText({
            text: '' + totalCount,
            tabId: tab.id
          });

          // ----- Update view
          view.showResults(context, documents, totalCount);
        }, errors.show);
      }
      else {
        errors.show('No context detected.');
      }
    });

  });
});
