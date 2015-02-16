'use strict';

require('zepto/zepto.min.js');
var Mustache = require('mustache');

var templates = require('../../templates/templates.js');

var Spinner = function() {
  this.timeout = null;
};

Spinner.prototype.show = function(message) {
  var resultsDisplay = $('#results');
  var resultsHtml = Mustache.render(templates.spinner, {
    message: message
  });
  resultsDisplay.html(resultsHtml);
};

Spinner.prototype.start = function() {
  var self = this;
  if(self.timeout) {
    clearTimeout(self.timeout);
  }
  self.timeout = setTimeout(function() {
    self.show("Searching...");
    self.timeout = setTimeout(function() {
      self.show("Still searching...");
      self.timeout = setTimeout(function() {
        self.show("Still waiting, but something is not right.");
      }, 10000);
    }, 1000);
  }, 250);
};

Spinner.prototype.stop = function() {
  if(this.timeout) {
    clearTimeout(this.timeout);
  }
  this.timeout = null;
};

module.exports = new Spinner();
