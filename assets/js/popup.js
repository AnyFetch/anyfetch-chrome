'use strict';

var async = require('async');

var config = require('./config/index.js');
var errors = require('./helpers/errors.js');
var postUpdateIfNecessary = require('./anyfetch/post-update-if-necessary.js');
var view = require('./popup/view.js');
var detectContext = require('./helpers/detect-context.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');
var search = require('./popup/search.js');

document.addEventListener('DOMContentLoaded', function() {
  var timeout = null;
  var ga = window.ga || function() {};

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
      if(!config.token) {
        errors.showSetupAccountError();
        return;
      }
      if(config.email) {
        ga('set', '&uid', config.email);
      }

      // Post update
      postUpdateIfNecessary();
      cb();
    },
    function getCurrentTab(cb) {
      // Detect context for the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if(!tabs || !tabs[0]) {
          return cb(new Error('Error while acquiring tab'));
        }
        return cb(null, tabs[0]);
      });
    },
    function getContext(tab, cb) {
      var site = getSiteFromTab(config.supportedSites, tab);
      if(!site) {
        return cb(new Error('No sites matched for the current tab'));
      }

      timeout = setTimeout(function() {
        view.showSpinner("Searching...");
        timeout = setTimeout(function() {
          view.showSpinner("Still searching...");
          timeout = setTimeout(function() {
            view.showSpinner("Still waiting, but something is not right.");
          }, 10000);
        }, 5000);
      }, 500);

      detectContext(tab, site, cb);
      ga('send', 'event', 'pageAction', 'click', site.name);
    },
    function filterContext(context, cb) {
      context.forEach(function(item) {
        if(config.blacklist[item.name]) {
          item.active = false;
        }
      });
      cb(null, context);
    },
    function showContextAndSearch(context, cb) {
      if(!context.length) {
        clearTimeout(timeout);
        return errors.show('No context detected.');
      }
      view.showContext(context);

      search(context, cb);
    }
  ], function(err) {
    if(timeout) {
      clearTimeout(timeout);
    }
    if(err) {
      if(err.message.indexOf('InvalidCredentials') !== -1 || err.message.indexOf('InvalidScope') !== -1) {
        errors.showSetupAccountError(err);
      }
      else {
        errors.show(err);
      }
    }
  });
});
