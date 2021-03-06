'use strict';

var async = require('async');
var rarity = require('rarity');

require('./helpers/error-stringifiable.js');
var config = require('./config/index.js');
var errors = require('./helpers/errors.js');
var view = require('./popover/view.js');
var spinner = require('./popover/spinner.js');
var saveUserData = require('./anyfetch/save-user-data.js');


document.addEventListener('DOMContentLoaded', function() {
  spinner.start();
  var mixpanel = window.mixpanel;

  var popup = false;
  if(chrome.tabs) {
    popup = true;
  }

  async.waterfall([
    // We need to wait on `chrome.storage` to load the user's settings
    // before doing anything else
    function loadSettings(cb) {
      config.store.loadSettings(cb);
    },
    function ensureUserLoaded(cb) {
      // Ensure we have all data (and we're logged too)
      if(!config.store.userId && config.store.token) {
        console.log('Missing some user data, updating.');
        return saveUserData(cb);
      }

      cb();
    },
    function getContext(cb) {
      if(!config.store.token) {
        cb(new Error('InvalidCredentials'));
        return;
      }

      mixpanel.identify(config.store.userId);

      if(popup) {
        mixpanel.people.set({
          'lastContext': new Date(),
        });
        mixpanel.people.increment({
          'ContextCount': 1
        });
      }
      else {
        mixpanel.people.set({
          'lastInjectedContext': new Date(),
        });
        mixpanel.people.increment({
          'InjectedContextCount': 1
        });
      }

      chrome.runtime.sendMessage({
        type: 'anyfetch::backgroundFindContext',
      }, rarity.pad([null], cb));
    },
    function reportAnalyticsAndSearch(response, cb) {
      var site = response.site;
      if(!site) {
        return cb(new Error('No sites matched for the current tab'));
      }

      mixpanel.track(
        popup ? 'Foreground Search' : 'Injected Search',
        {
          'Site': site.name
        }
      );

      var increment = {};
      increment[site.name + ' context view'] = 1;
      increment['context view'] = 1;
      mixpanel.people.increment(increment);

      chrome.runtime.sendMessage({
        type: 'anyfetch::backgroundGetResults',
        context: response.context
      }, function(results) {
        if(results.err) {
          return cb(results.err);
        }
        results.context = response.context;
        view.setSearchResults(results);
        view.setSearchHeader(results);
        cb(null);
      });
    }
  ], function(err) {
    spinner.stop();
    if(err && (err instanceof Error || err.message)) {
      if(err.message.indexOf('InvalidCredentials') !== -1 || err.message.indexOf('InvalidScope') !== -1 ||
        err.message.indexOf('GoneError') !== -1) {
        errors.showSetupAccountError(err);
        if(!popup) {
          // send a request to the background page since we are not allowed to open internal url from an external context
          document.querySelector('#loginlink').addEventListener('click', function bindCall(e) {
            e.preventDefault();
            chrome.runtime.sendMessage({
              type: 'anyfetch::backgroundOpenUrl',
              url: e.target.href
            });
          });
        }
      }
      else {
        errors.show(err);
      }
    }
  });
});
