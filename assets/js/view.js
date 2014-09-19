'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('./configuration.js');
var templates = require('../templates/templates.js');
var errors = require('./errors.js');

var resultsDisplay = $('#results');

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

var renderContext = function(context) {
  console.log(context);
  context = context.map(function(item) {
    return {
      name: item,
      active: true,
    };
  });
  var view = {
    context: context,
  };
  return Mustache.render(templates.context, view);

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
    context: renderContext(context),
    timeSlices: timeSlices,

    totalCount: totalCount,
    hasMore: (count < totalCount),

    appUrl: config.appUrl
  };
  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
};

module.exports.showContext = function(context) {
  errors.clear();


  // Render the view (just the userContext)
  var view = {
    context: renderContext(context),
  };
  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
};
