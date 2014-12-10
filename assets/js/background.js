'use strict';

var async = require('async');
var rarity = require('rarity');

var config = require('./config/index.js');
var detectContext = require('./helpers/detect-context.js');
var generateQuery = require('./helpers/content-helper.js').generateQuery;
var getCount = require('./anyfetch/get-count.js');
var getSiteFromTab = require('./helpers/get-site-from-tab.js');

function detectContextWithRetry(tab, site, attempts, delay, current, cb) {
  if(!cb) {
    cb = current;
    current = 0;
  }
  if(current >= attempts) {
    return cb(null, []);
  }
  detectContext(tab, site, function(err, context) {
    if(context.length) {
      return cb(null, context);
    }
    else {
      console.log('Retry: attempt ' + current + ' failed');
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
  chrome.pageAction.hide(tab.id);
  var site = getSiteFromTab(config.supportedSites, tab);
  if(!site) {
    return;
  }

  async.waterfall([
    function(cb) {
      setTimeout(function() {
        chrome.tabs.get(tab.id, function(updatedTab) {
          tab = updatedTab;
          cb();
        });
      }, 500);
    },
    function(cb) {
      detectContextWithRetry(tab, site, 2, 1000, cb);
    },
    function setIcon(context, cb) {
      if(!context.length) {
        return;
      }
      // We have detected a context, show a gray icon, while we don't have confirmation of some results
      chrome.pageAction.setIcon({
        tabId: tab.id,
        path: {
          '19': 'res/icon19_grayscale.png',
          '38': 'res/icon38_grayscale.png'
        }
      }, rarity.carry([context], cb));
    },
    function loadSettings(context, cb) {
      chrome.pageAction.show(tab.id);
      config.loadUserSettings(rarity.carry([context], cb));
    },
    function filterContext(context, cb) {
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
        return cb();
      }
      // We have some results, so show a the blue icon instead of the gray one
      chrome.pageAction.setIcon({
        tabId: tab.id,
        path: {
          '19': 'res/icon19.png',
          '38': 'res/icon38.png'
        }
      }, cb);
    }
  ]);
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
    chrome.tabs.create({url: 'views/first-run.html'});
  }
});

// listen for tabs url changes
chrome.tabs.onUpdated.addListener(handleOnUpdated);
