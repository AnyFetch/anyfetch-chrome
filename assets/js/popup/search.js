'use strict';

var view = require('./view.js');
var errors = require('../helpers/errors.js');
var getDocuments = require('../fetch/get-documents.js');
var sliceInTime = require('../helpers/slice-in-time.js');
var generateQuery = require('../helpers/content-helper.js').generateQuery;

var currentSearch = '';

function displayResults(search, documents, totalCount) {
  // Order documents by time periods
  var timeSlices = sliceInTime(documents);

  // Update view
  view.showResults(search, timeSlices, totalCount);
}

module.exports = function(context, cb) {
  if(!cb) {
    cb = function() {};
  }
  var search = generateQuery(context);
  currentSearch = search;

  // Retrieve documents
  getDocuments(search, function(err, documents, totalCount) {
    if(currentSearch !== search) {
      // Not the last search
      return cb(new Error('Not the last search'));
    }
    if(err) {
      if(err.indexOf('InvalidCredentials') !== -1 || err.indexOf('InvalidScope') !== -1) {
        errors.showSetupAccountError(err);
      }
      else {
        errors.show(err);
      }
      return cb(err);
    }
    displayResults(search, documents, totalCount);
    cb(null);
  });
};
