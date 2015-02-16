'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('../config/index.js');
var templates = require('../../templates/templates.js');
var errors = require('../helpers/errors.js');
var sliceInTime = require('../helpers/slice-in-time.js');
var analyticsHelper = require('../helpers/analytics-helper.js');
var spinner = require('./spinner.js');

var renderDocument = function(doc) {
  var view = {
    snippet: doc.rendered_snippet,
    actionUrl: doc.actions.show,
    documentType: doc.document_type.name,
    providerName: doc.provider.client ? doc.provider.client.name : ''
   };
  return Mustache.render(templates.listItem, view);
};

module.exports.setSearchResults = function setSearchResults(results) {
  var resultsDisplay = $('#results');
  errors.clear();

  // Render each document
  var timeSlices = sliceInTime(results.documents);
  var count = 0;
  timeSlices.forEach(function(slice) {
    slice.documents = slice.documents.map(renderDocument);
    slice.isActive = (slice.documents.length > 0);
    count += slice.documents.length;
  });

  // Render the overall results view (containing the list of documents)
  var view = {
    query: results.query,
    timeSlices: timeSlices,

    totalCount: results.count,
    hasMore: (count < results.count),

    appUrl: config.appUrl,
    managerUrl: config.managerUrl
  };

  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
  window.anyfetchAssets.formatDates();
  analyticsHelper.bindClickDocumentList();
  analyticsHelper.bindClickApp();
};

module.exports.search = function search(context, cb) {
  if(!cb) {
    cb = function() {};
  }
  // We store the last request time, so we can filter out old request in the callback
  var check = new Date().getTime();
  spinner.start();

  chrome.runtime.sendMessage({
    type: 'anyfetch::backgroundGetResults',
    context: context,
    check: check
  }, function(response) {
    // Let's ignore old requests
    if(response.check === check) {
      spinner.stop();
      module.exports.setSearchResults(response);
    }
    cb(null);
  });
};

module.exports.setContext = function setContext(context) {
  var contextDisplay = $('#context');
  var view = {
    context: context,
  };
  var resultsHtml = Mustache.render(templates.context, view);
  contextDisplay.html(resultsHtml);
  $('#context .context-selection .context-item > span').on('click', function(e) {
    chrome.runtime.sendMessage({
      type: 'anyfetch::backgroundToggleContextItem',
      name: e && e.target && e.target.textContent,
      context: context
    }, function(response) {
      setContext(response.context);
      module.exports.search(response.context);
    });
  });
};
