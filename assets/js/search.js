'use strict';

var view = require('./view.js');
var errors = require('./errors.js');
var getDocuments = require('./fetch/get-documents.js');
var sliceInTime = require('./helpers/slice-in-time.js');
var generateQuery = require('./context-utils.js').generateQuery;


module.exports = function(context) {
  var search = generateQuery(context);

  // Retrieve documents
  getDocuments(search, function(err, documents, totalCount) {
    if(err) {
      return errors.show(err);
    }
    if(!totalCount) {
      errors.noResultsShow();
    }
    // Order documents by time periods
    var timeSlices = sliceInTime(documents);

    // Update view
    view.showResults(search, timeSlices, totalCount);
  });
};
