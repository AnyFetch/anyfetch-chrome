'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('../config/index.js');
var templates = require('../../templates/templates.js');
var errors = require('../helpers/errors.js');
var sliceInTime = require('../helpers/slice-in-time.js');
var analyticsHelper = require('../helpers/analytics-helper.js');


module.exports.showSpinner = function showSpinner(message) {
  var resultsDisplay = $('#results');
  var resultsHtml = Mustache.render(templates.spinner, {message: message});
  resultsDisplay.html(resultsHtml);
};

var Spinner = function() {
  this.timeout = null;
};

Spinner.prototype.start = function() {
  var self = this;
  if(self.timeout) {
    clearTimeout(self.timeout);
  }
  self.timeout = setTimeout(function() {
    module.exports.showSpinner("Searching...");
    self.timeout = setTimeout(function() {
      module.exports.showSpinner("Still searching...");
      self.timeout = setTimeout(function() {
        module.exports.showSpinner("Still waiting, but something is not right.");
      }, 10000);
    }, 1000);
  }, 250);
};

Spinner.prototype.stop = function() {
  console.log('stop');
  if(this.timeout) {
    clearTimeout(this.timeout);
  }
  this.timeout = null;
};

module.exports.spinner = new Spinner();

var renderDocument = function(doc) {
  var view = {
    snippet: doc.rendered_snippet,
    actionUrl: doc.actions.show,
    documentType: doc.document_type.name,
    providerName: doc.provider.client ? doc.provider.client.name : 'No provider name'
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

var check = null;
module.exports.search = function search(context, cb) {
  if(!cb) {
    cb = function() {};
  }
  check = new Date().getTime();
  var spinner = module.exports.spinner;
  spinner.start();

  chrome.runtime.sendMessage({
    type: 'anyfetch::backgroundGetResults',
    context: context,
    check: check
  }, function(response) {
    spinner.stop();
    if(response.check === check) {
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
