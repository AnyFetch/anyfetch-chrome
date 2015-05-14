"use strict";

var getContextObject = require('./content-helper.js').getContextObject;
var injectScript = require('./content-script.js').injectScript;


/**
 * Return the detected elements from the title or an empty array
 * if the regex fails (expected context from a badly formatted title)
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} rule A rule from the context array of a supported site and
 *                      having a title field to match on
 * @return {Array}
 */
function getFromTitle(tab, rule) {
  var matches = tab.title.match(rule.title);
  if(matches && matches.length > 1) {
    // The first element is the input. We return the captured elements
    // from the string (parenthesis in the regexp)
    matches.shift();
    // Add rule's option to every context item
    matches = matches.map(function(match) {
      var item = {};
      item.value = match;
      item.type = rule.type;
      item.quote = !!rule.quote;
      if(rule.active === false) {
        item.active = rule.active;
      }
      else {
        item.active = true;
      }
      return item;
    });

    return getContextObject(matches);
  }
  return [];
}

/**
 * Inject content script in page, to get the context from the page's DOM
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 */
function getFromDOM(tab, site, cb) {
  // Add a timeout waiting for the page's answer
  var timeout = setTimeout(function() {
    callCb(new Error('Cannot get context from content script. Please retry!'));
  }, 5000);

  var callCb = function(err, context) {
    clearTimeout(timeout);
    cb(err, context);
  };

  var requestContext = function(site, cb) {
    chrome.tabs.sendMessage(tab.id, {type: 'anyfetch::csGetContext', site: site}, function(response) {
      if(!response) {
        return cb(null, []);
      }
      var context = getContextObject(response.context);
      cb(null, context);
    });
  };

  injectScript(tab.id, '/js/content-script.js', function(err) {
    if(err) {
      return callCb(err);
    }
    requestContext(site, callCb);
  });
}

/**
 * Detect the context from a target tab.
 * @param {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @param {Object} site A site from config.supportedSites
 * @return {Array} An array of Objects of the following format: {active: true, name: "the context"}
 *                 This array should not contain any duplicated item.
 *                 The `active` key is used to know if the user blacklisted this context.
 *                 This is initialized to true, and currently the filtering is done outside this function.
 */
module.exports = function detectContext(tab, site, cb) {
  var values = [];
  var dom = false;

  if(!site.context) {
    return cb(new Error('Missing context detection rules for ' + site.name));
  }
  else if(!Array.isArray(site.context)) {
    return cb(new Error('You must provide an array of rules for ' + site.name));
  }

  site.context.forEach(function(rule) {
    if(rule.title) {
      values = values.concat(getFromTitle(tab, rule));
    }
    else if(rule.dom) {
      dom = true;
    }
  });

  if(dom) {
    getFromDOM(tab, site, function(err, domvalues) {
      if(err) {
        return cb(err);
      }
      values = values.concat(domvalues);
      cb(null, values);
    });
  }
  else {
    cb(null, values);
  }
};
