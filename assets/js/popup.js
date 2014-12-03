'use strict';

var async = require('async');

var config = require('./config/index.js');
var errors = require('./helpers/errors.js');
var postUpdateIfNecessary = require('./fetch/post-update-if-necessary.js');
var view = require('./popup/view.js');
var detectContext = require('./popup/detect-context.js');
var search = require('./popup/search.js');

document.addEventListener('DOMContentLoaded', function() {
  var timeout;

  // TODO: cache results
  // TODO: add "Still indexing" warning (use GET / for server time and GET /provider for last hydrater status)
  // TODO: i18n
  // TODO: Get a proper error handling
  async.waterfall([
    // We need to wait on `chrome.storage` to load the user's settings
    // before doing anything else
    function loadSettings(cb) {
      config.loadUserSettings(cb);
    },
    function init(cb) {
      // Dynamically set manager url for no results
      document.getElementById('manager-url').setAttribute('href', config.managerUrl + '/providers');

      if(!config.token) {
        errors.showSetupAccountError();
        return;
      }

      // Post update
      postUpdateIfNecessary();
      cb();
    },
    function getCurrentTab(cb) {
      // Detect context for the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        return cb(null, tabs[0]);
      });
    },
    function getContext(tab, cb) {
      timeout = setTimeout(function() {
      view.showSpinner("Searching...");
        timeout = setTimeout(function() {
          view.showSpinner("Still searching...");
          timeout = setTimeout(function() {
            view.showSpinner("Still waiting, but something is not right.");
          }, 10000);
        }, 5000);
      }, 500);

      detectContext(tab, function(err, context) {
        if(err) {
          clearTimeout(timeout);
          return errors.show(err);
        }
        cb(null, context);
      });
    },
    function showContextAndSearch(context, cb) {
      if(!context.length) {
        clearTimeout(timeout);
        return errors.show('No context detected.');
      }
      view.showContext(context);

      search(context, function(err) {
        clearTimeout(timeout);
        if(err) {
          console.error(err);
          return;
        }
        cb();
      });
    }
  ]);
});
