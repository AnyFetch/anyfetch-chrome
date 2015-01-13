'use strict';

var async = require('async');
var rarity = require('rarity');

var config = require('./config/index.js');
var detectContext = require('./helpers/detect-context.js');
var generateQuery = require('./helpers/content-helper.js').generateQuery;
var getCount = require('./anyfetch/get-count.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');
var tabFunctions = require('./tab');


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
      if(!site) {
        return cb(true);
      }
      detectContextWithRetry(tab, site, 2, 1000, cb);
    },
    function setIcon(context, cb) {
      if(!context.length) {
        return cb(true);
      }
      // We have detected a context, show a gray icon, while we don't have confirmation of some results
      tabFunctions.activateExtension(tab.id, false);

      cb(null, context);
    },
    function loadSettings(context, cb) {
      tabFunctions.showExtension(tab.id);
      config.loadUserSettings(rarity.carry([context], cb));
    },
    function filterContext(context, cb) {
      if(!config.token) {
        return cb(new Error('No token'));
      }
      if(config.email) {
        console.log(new Date(), mixpanel);
        // mixpanel('set', '&uid', config.email);
      }

      context.forEach(function(item) {
        if(config.blacklist[item.name]) {
          item.active = false;
        }
      });
      cb(null, context);
    },
    function getDocumentCount(context, cb) {
      var query = generateQuery(context);
      getCount(query, cb);
    },
    function showBlue(count, cb) {
      if(!count) {
        // mixpanel('send', 'event', 'search', 'background', site.name, 0);
        return cb(true);
      }

      tabFunctions.setTitle(tab.id, 'Show context for ' + site.name);

      // mixpanel('send', 'event', 'search', 'background', site.name, count);
      // We have some results, let's show the blue icon instead of the gray one
      tabFunctions.activateExtension(tab.id, true);

      cb();
    }
  ], function(err) {
    if(err && err instanceof Error) {
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


// When the extension is installed or upgraded
chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason === "install") {
    // open first run page on install
    chrome.tabs.create({url: '/first-run.html'});
  }
});

// listen for tabs url changes
chrome.tabs.onUpdated.addListener(handleOnUpdated);
