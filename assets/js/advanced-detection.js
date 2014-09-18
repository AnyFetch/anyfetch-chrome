'use strict';
/* This file is injected in the page to find dom element that match the configuration */
/* global site: true */


require('zepto/zepto.min.js');

var turnObjToArray = function(obj) {
  return [].map.call(obj, function(element) {
    return element;
  });
};

function getValue(rule) {
  var nodes = turnObjToArray(document.querySelectorAll(rule.selector));
  nodes = nodes.map(function(node) {
    if(rule.target === 'innerHTML') {
      return node.innerHTML;
    }
    if(rule.target === 'value') {
      return node.value;
    }
    return node.getAttribute(rule.target);
  });
  return nodes;
}

function getContext(rules) {
  var values = [];
  rules.forEach(function(rule) {
    var value;
    if(Array.isArray(rule)) {
      // If the rule is an array of rule, we keep the first found
      for(var i = 0; i < rule.length; i += 1) {
        value = getValue(rule[i]);
        if(value.length) {
          values = values.concat(value);
        }
        if(value.length) {
          break;
        }
      }
    }
    else {
      value = getValue(rule);
      if(value.length) {
        values = values.concat(value);
      }
    }
  });
  return values;
}

chrome.runtime.sendMessage({context: getContext(site.context.dom)});
