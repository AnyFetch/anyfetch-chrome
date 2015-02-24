'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var templates = require('../../templates/templates.js');

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


module.exports.showSetupAccountError = function(err) {
  var resultsDisplay = $('#results');
  console.warn(err);
  resultsDisplay.html(Mustache.render(templates.login));
};
