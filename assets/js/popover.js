'use strict';

var async = require('async');

var config = require('./config/index.js');
var errors = require('./helpers/errors.js');
var view = require('./popover/view.js');
var detectContext = require('./helpers/detect-context.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');
var search = require('./popover/search.js');
var tabFunctions = require('./tab');
var saveUserData = require('./anyfetch/save-user-data.js');
var blacklist = require('./anyfetch/blacklist.js');


document.addEventListener('DOMContentLoaded', function() {
  var timeout = null;
  var mixpanel = window.mixpanel;
  var currentTab = null;

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
    function ensureUserLoaded(cb) {
      // Ensure we have all data (and we're logged too)
      if(!config.userId && config.token) {
        console.log("Missing some user data, updating.");
        return saveUserData(cb);
      }

      cb();
    },
    function getCurrentTab(cb) {
      if(!config.token) {
        errors.showSetupAccountError();
        return;
      }

      mixpanel.identify(config.userId);
      mixpanel.people.set({
        "lastContext": new Date(),
      });
      mixpanel.people.increment({
        "ContextCount": 1
      });

      // Detect context for the current tab
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        if(!tabs || !tabs[0]) {
          return cb(new Error('Error while acquiring tab'));
        }
        return cb(null, tabs[0]);
      });
    },
    function getContext(tab, cb) {
      currentTab = tab;
      var site = getSiteFromTab(config.supportedSites, currentTab);
      if(!site) {
        return cb(new Error('No sites matched for the current tab'));
      }

      mixpanel.track(
        "Foreground Search",
        {
          "Site": site.name
        }
      );

      var increment = {};
      increment[site.name + " context view"] = 1;
      increment["context view"] = 1;
      mixpanel.people.increment(increment);

      timeout = setTimeout(function() {
        view.showSpinner("Searching...");
        timeout = setTimeout(function() {
          view.showSpinner("Still searching...");
          timeout = setTimeout(function() {
            view.showSpinner("Still waiting, but something is not right.");
          }, 10000);
        }, 5000);
      }, 500);

      detectContext(currentTab, site, cb);
    },
    function filterContext(context, cb) {
      context = blacklist.filterQuery(context);

      cb(null, context);
    },
    function showContextAndSearch(context, cb) {
      if(!context.length) {
        clearTimeout(timeout);
        return errors.show('No context detected.');
      }
      view.showContext(context);

      search(context, cb);
    },
    function updateIcon(documentCount, cb) {
      // Force update the icon. Should not be useful, but in some rare cases the context detector enters a race condition with the page loading, and results could appear over a grey icon.
      tabFunctions.activateExtension(currentTab.id, documentCount > 0);

      cb();
    },
  ], function(err) {
    if(timeout) {
      clearTimeout(timeout);
    }
    if(err instanceof Error) {
      if(err.message.indexOf('InvalidCredentials') !== -1 || err.message.indexOf('InvalidScope') !== -1) {
        errors.showSetupAccountError(err);
      }
      else {
        errors.show(err);
      }
    }
  });
});
