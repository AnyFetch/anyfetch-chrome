'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('./configuration.js');
var templates = require('../templates/templates.js');
var errors = require('./errors.js');

var resultsDisplay = $('#results');
var contextDisplay = $('#context');

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

var toggleContext = function(e) {
  var context = e.target;
  if(context.classList.contains('inactive')) {
    context.classList.remove('inactive');
  }
  else {
    context.classList.add('inactive');
  }
};

module.exports.showContext = function(context) {
  context = context.map(function(item) {
    return {
      name: item,
      inactive: false,
    };
  });
  var view = {
    context: context,
  };
  var resultsHtml = Mustache.render(templates.context, view);
  contextDisplay.html(resultsHtml);
  $('#context .context-selection .context-item > span').on('click', toggleContext);
};

module.exports.showResults = function(search, context, timeSlices, totalCount) {
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
};
