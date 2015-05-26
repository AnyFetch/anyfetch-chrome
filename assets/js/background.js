'use strict';

var async = require('async');
var rarity = require('rarity');

var config = require('./config/index.js');
var detectContext = require('./helpers/detect-context.js');
var generateQuery = require('./helpers/content-helper.js').generateQuery;
var getCount = require('./anyfetch/get-count.js');
var getDocuments = require('./anyfetch/get-documents.js');
var getContacts = require('./anyfetch/get-contacts.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');
var tabFunctions = require('./tab');
var saveUserData = require('./anyfetch/save-user-data.js');
var blacklist = require('./anyfetch/blacklist.js');
var notificationHandler = require('./notification/index.js');


var detectContextWithRetry = function detectContextWithRetry(tab, site, retries, delay, cb) {
  async.retry(retries, function(cb) {
    detectContext(tab, site, function(err, context) {
      if(err) {
        return cb(err);
      }
      if(context.length) {
        return cb(null, context);
      }
      setTimeout(function() {
        // Update tab object, may have changed
        chrome.tabs.get(tab.id, function(newTab) {
          if(!newTab || tab.url !== newTab.url || tab.title !== newTab.title) {
            // We lost the tab, or the url changed, meaning a new process of detection as begun. Abort now
            return cb(null, []);
          }
          tab = newTab;
          delay = delay * 2;
          cb(new Error('No context detected'));
        });
      }, delay);
    });
  }, cb);
};

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
    function callDetectContext(cb) {
      site = getSiteFromTab(config.supportedSites, tab);

      // Unsupported website, skip.
      if(!site) {
        return;
      }

      // Everything looks fine (supported website), retrieve context
      detectContextWithRetry(tab, site, 5, 500, cb);
    },
    function setIcon(context, cb) {
      // Empty context, skip.
      if(!context.length) {
        return;
      }

      // Inject iframe if needed
      tabFunctions.inject(tab.id, site);

      // We have detected a context, show a gray icon, while we don't have confirmation of some results
      tabFunctions.activateExtension(tab.id, false);
      tabFunctions.showExtension(tab.id);

      cb(null, context);
    },
    function loadSettings(context, cb) {
      config.store.loadSettings(rarity.carry([context], cb));
    },
    function ensureUserLoaded(context, cb) {
      // User is not logged, display a notification and skip
      if(!config.store.token) {
        notificationHandler.displayNotLogged(site);
        return;
      }

      // Do we know everything about the user?
      // * Maybe we don't know the userId (first run), in which case we'll retrieve it
      // * Maybe the user had no Providers connected on last run, in which case we'll update our list.
      if(!config.store.userId || !config.store.providerCount) {
        console.log('Missing some user data, updating. Current userId: ' + config.store.userId + '. Current providerCount: ' + config.store.providerCount);
        return saveUserData(rarity.carry([context], cb));
      }

      cb(null, context);
    },
    function setupTracking(context, cb) {
      // User is logged in, but has no content yet.
      if(!config.store.providerCount) {
        notificationHandler.displayNoProviders();
        return;
      }

      // Identify the user (stored as super properties, no http call yet)
      mixpanel.identify(config.store.userId);
      mixpanel.register({
        'email': config.store.email,
        'userId': config.store.userId,
        'companyId': config.store.companyId,
        'App Version': chrome.runtime.getManifest().version
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
        increment[site.name + ' without results'] = 1;
        increment['without results'] = 1;

        mixpanel.people.increment(increment);
        return;
      }

      increment[site.name + ' with results'] = 1;
      increment['with results'] = 1;
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
 * Message listener for context requests
 * We return true to tell Chrome this listener is asynchronous or false to close the message channel
 * (@see https://developer.chrome.com/extensions/runtime#event-onMessage)
 */
var findContext = function findContext(request, sender, sendResponse) {
  var site = null;
  async.waterfall([
    function getTab(cb) {
      // If sent by a content script (injection)
      if(sender && sender.tab) {
        return cb(null, sender.tab);
      }
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        if(!chrome.runtime.lastError && tabs && tabs[0]) {
          return cb(null, tabs[0]);
        }
        return cb(chrome.runtime.lastError || new Error('Lost the tab'));
      });
    },
    function loadSettings(tab, cb) {
      config.store.loadSettings(rarity.carry([tab], cb));
    },
    function callDetectContext(tab, cb) {
      site = getSiteFromTab(config.supportedSites, tab);

      // Unsupported website, skip.
      if(!site) {
        return cb(new Error('Unsupported website'));
      }

      // Everything looks fine (supported website), retrieve context
      detectContextWithRetry(tab, site, 5, 500, cb);
    },
  ], function(err, context) {
    if(err) {
      sendResponse({err: err});
      return false;
    }
    sendResponse({
      site: site,
      context: blacklist.filterQuery(context)
    });
  });
  return true;
};


/**
 * Message listener for search requests
 * We return true to tell Chrome this listener is asynchronous or false to close the message channel
 * (@see https://developer.chrome.com/extensions/runtime#event-onMessage)
 */
var getResults = function getResults(request, sender, sendResponse) {
  var context = request.context;
  if(!context.length) {
    return false;
  }

  var query = generateQuery(context);
  var payload = {
    query: query,
    check: request.check
  };

  async.auto({
    loadSettings: function loadSettings(cb) {
      config.store.loadSettings(cb);
    },
    searchDocuments: ['loadSettings', function searchDocuments(cb) {
      getDocuments(query, cb);
    }],
    searchContacts: ['loadSettings', function searchContacts(cb) {
      getContacts(query, cb);
    }]
  }, function(err, results) {
    if(err) {
      sendResponse({err: err});
      return false;
    }
    payload.documents = results.searchDocuments[0];
    payload.count = results.searchDocuments[1];
    payload.contacts = results.searchContacts[0];
    sendResponse(payload);
  });

  return true;
};

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
 * Message listener for the end of authentification
 * We return false to tell Chrome this listener is synchronous
 * (@see https://developer.chrome.com/extensions/runtime#event-onMessage)
 */
var loginSuccessful = function loginSuccessful(request, sender, sendResponse) {
  refreshTabs();
  sendResponse();
  return false;
};

/**
 * Message listener to open a url from the background page
 * We return false to tell Chrome this listener is synchronous
 * (@see https://developer.chrome.com/extensions/runtime#event-onMessage)
 */
var openUrl = function openUrl(request, sender, sendResponse) {
  chrome.tabs.create({url: request.url});
  sendResponse();
  return false;
};

/**
 * When the extension is installed or upgraded
 */
chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason === 'install') {
    // open first run page on install
    chrome.tabs.create({url: '/first-run.html'});
  }
  else if(details.reason === 'update') {
    refreshTabs();
  }
});

/**
 * Listen for tabs url changes
 */
chrome.tabs.onUpdated.addListener(handleOnUpdated);

/**
 * Message handler for inter instance messaging
 */
chrome.runtime.onMessage.addListener(function messageHandler(request, sender, sendResponse) {
  var handlers = {
    'anyfetch::backgroundFindContext': findContext,
    'anyfetch::backgroundGetResults': getResults,
    'anyfetch::backgroundLoginSuccessful': loginSuccessful,
    'anyfetch::backgroundOpenUrl': openUrl
  };
  if(request.type && handlers[request.type]) {
    // return to chrome while explicitly casting to boolean
    return !!handlers[request.type](request, sender, sendResponse);
  }
  return false;
});
