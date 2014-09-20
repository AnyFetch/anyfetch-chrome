'use strict';

var view = require('./view.js');
var errors = require('./errors.js');
var getDocuments = require('./fetch/get-documents.js');
var sliceInTime = require('./helpers/slice-in-time.js');
var generateQuery = require('./context-utils.js').generateQuery;

var currentSearch = '';

function displayResults(search, documents, totalCount) {
  // Order documents by time periods
  var timeSlices = sliceInTime(documents);

  // Update view
  view.showResults(search, timeSlices, totalCount);
}

module.exports = function(context) {
  var search = generateQuery(context);
  currentSearch = search;

  // Retrieve documents
  getDocuments(search, function(err, documents, totalCount) {
    if(currentSearch !== search) {
      // Not the last search
      return;
    }
    if(err) {
      return errors.show(err);
    }
    if(!totalCount) {
      errors.noResultsShow();
    }
    displayResults(search, documents, totalCount);
  });
};
