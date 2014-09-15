'use strict';
/* This file is injected in the page to find dom element that match the configuration */

require('zepto/zepto.min.js');
var supportedSites = require('./configuration.js').supportedSites;

var turnObjToArray = function(obj) {
  return [].map.call(obj, function(element) {
    return element;
  });
};

var site;
var toSearch = [];
for (var siteName in supportedSites) {
  site = supportedSites[siteName];
  if(document.location.href.match(site.url)) {
    site.context.dom.forEach(function(domMatch) {
      var elements = document.querySelectorAll(domMatch);
      elements = turnObjToArray(elements);
      elements.forEach(function(element) {
        toSearch.push(element);
      });
    });
  }
}

chrome.runtime.sendMessage({context: toSearch});
