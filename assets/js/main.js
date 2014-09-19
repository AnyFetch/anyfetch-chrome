'use strict';

require('zepto/zepto.min.js');
var config = require('./configuration.js');

// We need to wait on `chrome.storage` to load the user's settings
// before doing anything else
config.loadUserSettings(function() {
  var view = require('./view.js');
  var errors = require('./errors.js');

  var detectContext = require('./detect-context.js');
  var getDocuments = require('./fetch/get-documents.js');
  var postUpdateIfNecessary = require('./fetch/post-update-if-necessary.js');
  var sliceInTime = require('./helpers/slice-in-time.js');

  // TODO: cache results
  // TODO: add "Still indexing" warning (use GET / for server time and GET /provider for last hydrater status)
  // TODO: i18n

  var main = function() {
    if(!config.token) {
      errors.show('Please <a href="options.html" target="_blank">setup your AnyFetch account</a> to start using AnyFetch.');
      return;
    }

    // Post update
    postUpdateIfNecessary();

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      // Detect context for the current tab
      detectContext(tab, function(err, search, context) {
        if(err) {
          errors.show(err);
          return;
        }
        if(search) {
          view.showContext(context);
          // Retrieve documents
          getDocuments(search, function success(documents, totalCount) {
            // Order documents by time periods
            var timeSlices = sliceInTime(documents);

            // Update view
            view.showResults(search, context, timeSlices, totalCount);
          }, errors.show);
        }
        else {
          errors.show('No context detected.');
        }
      });
    });
  };

  $(document).ready(main);
});
