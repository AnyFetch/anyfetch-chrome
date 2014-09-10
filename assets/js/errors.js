'use strict';

require('zepto/zepto.min.js');

var resultsDisplay = $('#results');
var errorDisplay = $('#error');

module.exports.show = function(err) {
  console.warn(err);
  resultsDisplay.empty();
  errorDisplay.html(err);
  errorDisplay[0].classList.remove('hidden');
};

module.exports.clear = function() {
  errorDisplay[0].classList.add('hidden');
  errorDisplay.empty();
};
