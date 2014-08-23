'use strict';

require('../../node_modules/zepto/zepto.min.js');

var resultsDisplay = $('#results');
var errorDisplay = $('#error');

module.exports.show = function(err) {
  console.warn(err);
  resultsDisplay.html('');
  errorDisplay.html(err);
  errorDisplay.show();
};

module.exports.clear = function() {
  errorDisplay.hide();
  errorDisplay.innerHTML = '';
};
