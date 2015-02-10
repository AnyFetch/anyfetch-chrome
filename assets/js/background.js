'use strict';

var async = require('async');
var rarity = require('rarity');

var config = require('./config/index.js');
var detectContext = require('./helpers/detect-context.js');
var generateQuery = require('./helpers/content-helper.js').generateQuery;
var getCount = require('./anyfetch/get-count.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');
var tabFunctions = require('./tab');
var saveUserData = require('./anyfetch/save-user-data.js');
var blacklist = require('./anyfetch/blacklist.js');
var notificationHandler = require('./notification/index.js');


function detectContextWithRetry(tab, site, attempts, delay, current, cb) {
  if(!cb) {
    cb = current;
    current = 0;
  }
  if(current >= attempts) {
    return cb(null, []);
  }
  detectContext(tab, site, function(err, context) {
    if(err) {
      return cb(err);
    }
    if(context.length) {
      return cb(null, context);
    }
    else {
      setTimeout(function() {
        // Update tab object, may have changed
        chrome.tabs.get(tab.id, function(tab) {
          if(!tab) {
            // We lost the tab, abort now
            return cb(null, []);
          }
          detectContextWithRetry(tab, site, attempts, delay * 2, current + 1, cb);
        });
      }, delay);
    }
  });
}

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
function managePageAction(tab) {
  // Force cast to boolean
  if(!tab || !tab.id) {
    return;
  }
  var mixpanel = window.mixpanel;
  var site;
  tabFunctions.hideExtension(tab.id);
  if(chrome.runtime.lastError) {
    // lost the tab, might happen sometimes
    return;
  }

  async.waterfall([
    function confirmTab(cb) {
      setTimeout(function() {
        chrome.tabs.get(tab.id, function(updatedTab) {
          if(chrome.runtime.lastError) {
            // lost the tab, might happen sometimes
            return cb('Lost the tab');
          }
          tab = updatedTab;
          cb();
        });
      }, 500);
    },
    function(cb) {
      site = getSiteFromTab(config.supportedSites, tab);

      // Unsupported website, skip.
      if(!site) {
        return;
      }

      // Everything looks fine (logged and supported website), retrieve context
      detectContextWithRetry(tab, site, 2, 1000, cb);
    },
    function setIcon(context, cb) {
      // Empty context, skip.
      if(!context.length) {
        return;
      }
      // We have detected a context, show a gray icon, while we don't have confirmation of some results
      tabFunctions.activateExtension(tab.id, false);

      cb(null, context);
    },
    function loadSettings(context, cb) {
      tabFunctions.showExtension(tab.id);
      config.loadUserSettings(rarity.carry([context], cb));
    },
    function ensureUserLoaded(context, cb) {
      // User is not logged, display a notification and skip
      if(!config.token) {
        notificationHandler.displayNotLogged(site);
        return;
      }

      // Do we know everything about the user?
      // * Maybe we don't know the userId (first run), in which case we'll retrieve it
      // * Maybe the user had no Providers connected on last run, in which case we'll update our list.
      if(!config.userId || !config.providerCount) {
        console.log("Missing some user data, updating. Current userId: " + config.userId + ". Current providerCount: " + config.providerCount);
        return saveUserData(rarity.carry([context], cb));
      }

      cb(null, context);
    },
    function setupTracking(context, cb) {
      // User is logged in, but has no content yet.
      if(!config.providerCount) {
        notificationHandler.displayNoProviders();
        return;
      }

      // Identify the user (stored as super properties, no http call yet)
      mixpanel.identify(config.userId);
      mixpanel.register({
        "email": config.email,
        "userId": config.userId,
        "companyId": config.companyId,
        "App Version": chrome.runtime.getManifest().version
      });

      cb(null, context);
    },
    function getDocumentCount(context, cb) {
      context = blacklist.filterQuery(context);
      var query = generateQuery(context);
      getCount(query, cb);
    },
    function showBlue(count, cb) {
      var increment = {};
      increment['background view'] = 1;
      increment[site.name] = 1;

      if(!count) {
        increment[site.name + " without results"] = 1;
        increment["without results"] = 1;

        mixpanel.people.increment(increment);
        return;
      }

      increment[site.name + " with results"] = 1;
      increment["with results"] = 1;
      mixpanel.people.increment(increment);

      tabFunctions.setTitle(tab.id, 'Show context for ' + site.name);
      // We have some results, let's show the blue icon instead of the gray one
      tabFunctions.activateExtension(tab.id, true);

      cb();
    }
  ], function(err) {
    if(err) {
      console.warn(err);
    }
  });
}

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
function handleOnUpdated(tabId, changeInfo, tab) {
  if(changeInfo.status === 'complete' && tab.id && tab.url) {
    managePageAction(tab);
  }
}

/**
 * Search each tab for a context, and update icon with managePageAction
 */
function refreshTabs() {
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      managePageAction(tab);
    });
  });
}

/**
 * When the extension is installed or upgraded
 */
chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason === "install") {
    // open first run page on install
    chrome.tabs.create({url: '/first-run.html'});
  }
});

// listen for tabs url changes
chrome.tabs.onUpdated.addListener(handleOnUpdated);

/**
 * Message handler for inter instance messaging
 */
var messageHandler = function messageHandler(request, sender, sendResponse) {
  // Reload contexts on successful login message from login page
  if(request.type === 'anyfetch::loginSuccessful') {
    refreshTabs();
    sendResponse();
  }
};
chrome.runtime.onMessage.addListener(messageHandler);
