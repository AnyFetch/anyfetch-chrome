'use strict';

require('zepto/zepto.min.js');
var config = require('../config/configuration.js');

// We need to wait on `chrome.storage` to load the user's settings
// before doing anything else
config.loadUserSettings(function() {
  var errors = require('../helpers/errors.js');

  var detectContext = require('./detect-context.js');
  var view = require('./view.js');
  var postUpdateIfNecessary = require('../fetch/post-update-if-necessary.js');
  var search = require('./search.js');

  // TODO: cache results
  // TODO: add "Still indexing" warning (use GET / for server time and GET /provider for last hydrater status)
  // TODO: i18n

  var main = function() {
    // Dynamically set manager url for no results
    document.getElementById('manager-url').setAttribute('href', config.managerUrl + '/providers');

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

        var timeout = setTimeout(function() {
          view.showSpinner("Searching...");
          timeout = setTimeout(function() {
            view.showSpinner("Still searching...");
            timeout = setTimeout(function() {
              view.showSpinner("Still waiting, but something is not right.");
            }, 10000);
          }, 5000);
        }, 500);

        search(context, function(err) {
          if(err) {
            console.error(err);
            return;
          }
          clearTimeout(timeout);
        });
      });
    });
  };

  $(document).ready(main);
});
