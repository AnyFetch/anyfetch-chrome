'use strict';

var Mustache = require('../../lib/mustache/mustache.js');

var templates = require('../templates/templates.js');
var detectContext = require('./detect-context.js');

// TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
// chrome.tabs.query(null, cb([tabs]));
// TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
// chrome.browserAction.disable(tab.id);

chrome.tabs.getSelected(null, function(tab) {
  var resultsDisplay = document.getElementById('results');
  var errorDisplay = document.getElementById('error');

  var context = detectContext(tab.url, tab.title);
  if(context) {
    // TODO: adjust view when switching back and forth between tabs
    errorDisplay.innerHTML = '';

    // TODO: trigger a search and update the badge count
    var documents = [
      {title: 'Lorem'},
      {title: 'Ipsum'},
      {title: 'Dolor'},
      {title: 'Sit'},
      {title: 'Amet'}
    ];
    var view = {
      context: context,
      results: documents.map(function(doc) {
        return Mustache.render(templates.snippet, doc);
      })
    };
    var resultsHtml = Mustache.render(templates.results, view);
    resultsDisplay.innerHTML = resultsHtml;

    // `tabId` restricts the badge count to a specific tab
    // The badge is reset when the targeted tab is closed
    chrome.browserAction.setBadgeText({
      text: '' + tab.id,
      tabId: tab.id
    });
  }
  else {
    resultsDisplay.innerHTML = '';
    errorDisplay.innerHTML = 'No context detected';
    //chrome.browserAction.disable(tab.id);
  }
});
