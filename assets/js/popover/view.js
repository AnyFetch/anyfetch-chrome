'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('../config/index.js');
var templates = require('../../templates/templates.js');
var errors = require('../helpers/errors.js');
var sliceInTime = require('../helpers/slice-in-time.js');
var analyticsHelper = require('../helpers/analytics-helper.js');

var renderDocument = function(doc) {
  if(templates['doctype_' + doc.document_type.id]) {
    doc.rendered_snippet = Mustache.render(templates['doctype_' + doc.document_type.id], doc.data);
  }
  var view = {
    snippet: doc.rendered_snippet,
    actionUrl: doc.actions.show,
    documentType: doc.document_type.name,
    providerName: doc.provider.client ? doc.provider.client.name : '',
    providerId: doc.provider.client ? doc.provider.client.id : ''
  };
  return Mustache.render(templates.snippet, view);
};

module.exports.setSearchResults = function setSearchResults(results) {
  var resultsDisplay = $('#results');
  errors.clear();

  // Remove documen which match contact in header
  var headerContact = results.contacts.length ? results.contacts[0] : null;
  if(headerContact) {
    results.documents = results.documents = results.documents.filter(function(doc) {
      return doc.id !== headerContact.id;
    });
  }

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

    appUrl: config.store.appUrl,
    managerUrl: config.store.managerUrl
  };

  var resultsHtml = Mustache.render(templates.results, view);
  resultsDisplay.html(resultsHtml);
  window.anyfetchAssets.formatDates();
  analyticsHelper.bindClickDocumentList();
  analyticsHelper.bindClickApp();
};

module.exports.setSearchHeader = function setSearchHeader(results) {
  var headerDisplay = $('#header');
  var view = {
    contactHeader: results.contacts.length ? results.contacts[0] : null,
  };

  var headerHtml = Mustache.render(templates.header, view);
  headerDisplay.html(headerHtml);
};

