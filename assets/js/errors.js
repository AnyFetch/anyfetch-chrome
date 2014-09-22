'use strict';

require('zepto/zepto.min.js');

var resultsDisplay = $('#results');
var errorDisplay = $('#error');
var noResultsDisplay = $('#noresultserror');

module.exports.show = function(err) {
  console.warn(err);
  resultsDisplay.empty();
  errorDisplay.html(err);
  errorDisplay[0].classList.remove('hidden');
};

module.exports.clear = function() {
  //noResultsDisplay[0].classList.add('hidden');
  errorDisplay[0].classList.add('hidden');
  errorDisplay.empty();
};

module.exports.noResultsShow = function() {
  resultsDisplay.empty();
  noResultsDisplay[0].classList.remove('hidden');
};
