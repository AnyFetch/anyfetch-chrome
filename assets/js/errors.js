'use strict';

require('zepto/zepto.min.js');


module.exports.show = function(err) {
  var resultsDisplay = $('#results');
  var errorDisplay = $('#errors');
  console.warn(err);
  resultsDisplay.empty();
  errorDisplay.html(err);
  errorDisplay[0].classList.remove('hidden');
};

module.exports.clear = function() {
  var errorDisplay = $('#errors');
  errorDisplay[0].classList.add('hidden');
  errorDisplay.empty();
};

module.exports.noResultsShow = function() {
  var resultsDisplay = $('#results');
  var noResultsDisplay = $('#noresultserror');
  resultsDisplay.empty();
  noResultsDisplay[0].classList.remove('hidden');
};

module.exports.showSetupAccountError = function(err) {
  var resultsDisplay = $('#results');
  var errorDisplay = $('#errors');
  if(err) {
    console.warn(err);
  }
  resultsDisplay.empty();
  errorDisplay.html('Please <a href="first-run.html" target="_blank">setup your AnyFetch account</a> to start using AnyFetch.');
  errorDisplay[0].classList.remove('hidden');
};
