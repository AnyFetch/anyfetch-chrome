'use strict';

require('zepto/zepto.min.js');
var config = require('./configuration.js');

// We need to wait on `chrome.storage` to load the user's settings
// before doing anything else
config.loadUserSettings(function() {
  var errors = require('./errors.js');

  var detectContext = require('./detect-context.js');
  var view = require('./view.js');
  var postUpdateIfNecessary = require('./fetch/post-update-if-necessary.js');
  var search = require('./search.js');

  // TODO: cache results
  // TODO: add "Still indexing" warning (use GET / for server time and GET /provider for last hydrater status)
  // TODO: i18n

  var main = function() {
    if(!config.token) {
      errors.showSetupAccountError();
      return;
    }

    // Post update
    postUpdateIfNecessary();

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      // Detect context for the current tab
      detectContext(tab, function(err, context) {
        if(err) {
          return errors.show(err);
        }
        if(!context.length) {
          return errors.show('No context detected.');
        }
        view.showContext(context);
        search(context, function(err) {
          if(err) {
            return;
          }
        });
      });
    });
  };

  $(document).ready(main);
});
