'use strict';

require('../../node_modules/zepto/zepto.min.js');
var Mustache = require('../../node_modules/mustache/mustache.js');

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
    actionUrl: doc.actions.show
  };
  return Mustache.render(templates.listItem, view);
};

module.exports.showResults = function(context, documents, totalCount) {
  errors.clear();

  // Render each document
  var renderedResults = documents.map(renderDocument);

  // Render the overall results view (containing the list of documents)
  var view = {
    context: context,
    results: renderedResults,

    totalCount: totalCount,
    hasMore: (documents.length < totalCount),

    appUrl: config.appUrl
  };
  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
};