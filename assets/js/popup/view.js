'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('../config/index.js');
var templates = require('../../templates/templates.js');
var errors = require('../helpers/errors.js');
var search = require('./search.js');
var gaHelper = require('../helpers/ga-helper.js');

var renderDocument = function(doc) {
  var snippetTemplate = templates.snippet;
  if(doc.document_type && doc.document_type.templates && doc.document_type.templates.snippet) {
    snippetTemplate = doc.document_type.templates.snippet;
  }
  var view = {
    snippet: Mustache.render(snippetTemplate, doc.data),
    actionUrl: doc.actions.show,
    documentType: doc.document_type.name,
    providerName: doc.provider.client.name
   };
  return Mustache.render(templates.listItem, view);
};

var toggleContext = function(toToggle, context) {
  context.some(function(item, index, context) {
    if(item.name === toToggle) {
      var newState = !item.active;
      context[index].active = newState;
      if(config.blacklist[item.name] && newState) {
        delete config.blacklist[item.name];
      }
      else if(!newState) {
        config.blacklist[item.name] = true;
      }
      chrome.storage.sync.set({blacklist: config.blacklist});
      return true;
    }
    return false;
  });
  search(context);
  module.exports.showContext(context);
};

module.exports.showContext = function(context) {
  var contextDisplay = $('#context');
  var viewContext = context.map(function(item) {
    return {
      name: item.name,
      inactive: !item.active,
    };
  });
  var view = {
    context: viewContext,
  };
  var resultsHtml = Mustache.render(templates.context, view);
  contextDisplay.html(resultsHtml);
  $('#context .context-selection .context-item > span').on('click', function(e) {
    toggleContext(e && e.target && e.target.textContent, context);
  });
};

module.exports.showSpinner = function(message) {
  var resultsDisplay = $('#results');
  var resultsHtml = Mustache.render(templates.spinner, {message: message});
  resultsDisplay.html(resultsHtml);
};

module.exports.showResults = function(search, timeSlices, totalCount) {
  var resultsDisplay = $('#results');
  errors.clear();

  // Render each document
  var count = 0;
  timeSlices.forEach(function(slice) {
    slice.documents = slice.documents.map(renderDocument);
    slice.isActive = (slice.documents.length > 0);
    count += slice.documents.length;
  });

  // Render the overall results view (containing the list of documents)
  var view = {
    search: search,
    timeSlices: timeSlices,

    totalCount: totalCount,
    hasMore: (count < totalCount),

    appUrl: config.appUrl,
    managerUrl: config.managerUrl
  };
  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
  window.anyfetchAssets.formatDates();
  gaHelper.bindClickDocumentList();
  gaHelper.bindClickApp();
};
