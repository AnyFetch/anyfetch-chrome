'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var config = require('../config/index.js');
var templates = require('../../templates/templates.js');
var errors = require('../helpers/errors.js');
var sliceInTime = require('../helpers/slice-in-time.js');
var analyticsHelper = require('../helpers/analytics-helper.js');

var renderDocument = function(doc) {
  if(doc.data.snippet) {
    // Sanitize the snippet
    // 1 Removes the <br>
    // 2 Replaces all spaces or following spaces (including &nbsp; which is important for us) by a single space
    // 3 Replaces ponctuation at the beginning (ex ", Hello" => "Hello")
    // 4 Same thing at the and, because why not
    doc.data.snippet = doc.data.snippet.trim();
    doc.data.snippet = doc.data.snippet
                        .replace(/<br\s*[\/]?>/gi, '')
                        .replace(/\s+/g, ' ')
                        .replace(/^[\.,-\/#!$%\^&\*;:{}=\-_`~()]+\s*/g, '')
                        .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]+\s*$/g, '');
  }

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

  // Remove document which match contact in header
  var headerContact = results.contacts.length ? results.contacts[0] : null;
  if(headerContact) {
    results.documents = results.documents.filter(function(doc) {
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


  // If view.contactHeader is null, try to detect a default contact on the context
  if(!view.contactHeader) {
    results.context.some(function(context) {
      if(context.type === 'main-contact') {
        view.contactFallback = context.value;
        return true;
      }
      return false;
    });
  }

  var headerHtml = Mustache.render(templates.header, view);
  headerDisplay.html(headerHtml);
};

