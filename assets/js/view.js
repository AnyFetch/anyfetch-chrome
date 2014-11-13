'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('./configuration.js');
var templates = require('../templates/templates.js');
var errors = require('./errors.js');
var search = require('./search.js');

var renderDocument = function(doc) {
  var snippetTemplate = templates.snippet;
  if(doc.document_type && doc.document_type.templates && doc.document_type.templates.snippet) {
    snippetTemplate = doc.document_type.templates.snippet;
  }
  var view = {
    snippet: Mustache.render(snippetTemplate, doc.data),
    actionUrl: doc.actions.show,
    type: doc.document_type.name
  };
  return Mustache.render(templates.listItem, view);
};

var toggleContext = function(toToggle, context) {
  context = context.map(function(item) {
    if(item.name === toToggle) {
      item.active = !item.active;
    }
    return item;
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
    toggleContext(e && e.target && e.target.innerHTML, context);
  });
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

    appUrl: config.appUrl
  };
  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
  window.anyfetchAssets.formatDates();
};
