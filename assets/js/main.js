'use strict';

var config = require('./configuration.js');

// We need to wait on `chrome.storage` to load the user's settings
// before doing anything else
config.loadUserSettings(function() {
  var view = require('./view.js');
  // TODO: the badge doesn't exist in PageActions
  // var badge = require('./badge.js');
  var errors = require('./errors.js');

  var detectContext = require('./detect-context.js');
  var getDocuments = require('./get-documents.js');
  var postUpdateIfNecessary = require('./post-update-if-necessary.js');

  // TODO: start loading results without waiting to be clicked
  // See: https://developer.chrome.com/extensions/declarativeContent#type-RequestContentScript
  // TODO: i18n
  // TODO: cache results & adjust view when switching back and forth between tabs

  var main = function() {
    if(!config.token) {
      errors.show('Please <a href="options.html" target="_blank">setup your AnyFetch account</a> to start using AnyFetch.');
      return;
    }

    // ----- Post update
    postUpdateIfNecessary();

    chrome.tabs.getSelected(null, function(tab) {
      // ----- Detect context for the current tab
      var context = detectContext(tab.url, tab.title);
      if(context) {

        // ----- Retrieve documents
        getDocuments(context, function success(documents, totalCount) {
          // ----- Update view
          view.showResults(context, documents, totalCount);
        }, errors.show);
      }
      else {
        errors.show('No context detected.');
      }
    });
  };

  $(document).ready(main);
});
