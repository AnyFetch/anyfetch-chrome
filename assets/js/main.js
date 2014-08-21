'use strict';

require('../../node_modules/zepto/zepto.min.js');
var Mustache = require('../../node_modules/mustache/mustache.js');

var config = require('./configuration.js');
var templates = require('../templates/templates.js');
var detectContext = require('./detect-context.js');
var getDocuments = require('./get-documents.js');

// TODO: go through the tabs and disable the BrowserAction for each, except the supported sites.
// chrome.tabs.query(null, cb([tabs]));
// TODO: consider using a PageAction rather than a BrowserAction (https://developer.chrome.com/extensions/overview)
// chrome.browserAction.disable(tab.id);
// TODO: look-ahead (do not wait to be clicked to fetch results)
// TODO: send updates (~30min delay)

$(document).ready(function() {

  var resultsDisplay = $('#results');
  var errorDisplay = $('#error');

  var showError = function(err) {
    console.log(err);
    resultsDisplay.html('');
    errorDisplay.html(err);
  };

  chrome.tabs.getSelected(null, function(tab) {

    // ----- Detect context
    var context = detectContext(tab.url, tab.title);
    if(context) {
      // TODO: adjust view when switching back and forth between tabs
      errorDisplay.innerHTML = '';

      // ----- Retrieve documents
      getDocuments(context, function success(documents) {
        var count = documents.length;
        var renderedResults = documents.map(function(doc) {
          console.log(doc);
          var snippetTemplate = templates.snippet;
          if(doc.document_type && doc.document_type.templates && doc.document_type.templates.snippet) {
            snippetTemplate = doc.document_type.templates.snippet;
          }
          var view = {
            snippet: Mustache.render(snippetTemplate, doc.data),
            actionUrl: doc.actions.show
          };
          return Mustache.render(templates.listItem, view);
        });

        // ----- Update view
        var view = {
          context: context,
          results: renderedResults,
          appUrl: config.anyFetchAppUrl
        };
        var resultsHtml = Mustache.render(templates.results, view);
        resultsDisplay.html(resultsHtml);

        // `tabId` restricts the badge count to a specific tab
        // The badge is reset when the targeted tab is closed
        chrome.browserAction.setBadgeText({
          text: '' + count,
          tabId: tab.id
        });

      }, showError);
    }
    else {
      showError('No context detected.');
    }
  });

});