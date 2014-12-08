'use strict';

var config = require('./config/index.js');
var detectContext = require('./helpers/detect-context.js');
var generateQuery = require('./helpers/content-helper.js').generateQuery;
var getCount = require('./fetch/get-count.js');
var async = require('async');

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
        detectContextWithRetry(tab, site, attempts, delay * 2, current + 1, cb);
      }, delay);
    }
  });
}

/**
 * Show pageAction when tab URL matches supportedSites.url regex
 */
function managePageAction(tab) {
  chrome.pageAction.hide(tab.id);
  var site;
  for(var siteName in config.supportedSites) {
    site = config.supportedSites[siteName];
    if(tab.url.match(site.url)) {
      async.waterfall([
        function(cb) {
          detectContextWithRetry(tab, site, 2, 1000, cb);
        },
        function setIcon(context, cb) {
          console.log(context);
          if(!context.length) {
            return;
          }
          chrome.pageAction.setIcon({
            tabId: tab.id,
            path: {
              '19': 'res/icon19_grayscale.png',
              '38': 'res/icon38_grayscale.png'
            }
          }, function() {
            cb(null, context);
          });
        },
        function loadSettings(context, cb) {
          chrome.pageAction.show(tab.id);
          config.loadUserSettings(function(err) {
            cb(err, context);
          });
        },
        function filterContext(context, cb) {
          context = context.map(function(item) {
            if(config.blacklist[item.name]) {
              item.active = false;
            }
            return item;
          });
          cb(null, context);
        },
        function getDocumentCount(context, cb) {
          var query = generateQuery(context);
          getCount(query, cb);
        },
        function showBlue(count, cb) {
          console.log(arguments);
          if(!count) {
            return cb();
          }
          chrome.pageAction.setIcon({
            tabId: tab.id,
            path: {
              '19': 'res/icon19.png',
              '38': 'res/icon38.png'
            }
          }, cb);
        }
      ]);
      return;
    }
  }
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
