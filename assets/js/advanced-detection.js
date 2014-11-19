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
    var value = '';
    if(rule.target === 'innerHTML') {
      value = node.innerHTML;
    }
    else if(rule.target === 'textContent') {
      console.log(node.textContent);
      value = node.textContent;
    }
    else if(rule.target === 'value') {
      value = node.value;
    }
    else {
      value = node.getAttribute(rule.target);
    }

    return value.trim();
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
