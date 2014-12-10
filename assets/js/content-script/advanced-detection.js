'use strict';
/* This file is injected in the page to find dom element that match the configuration */

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

var messageHandler = function messageHandler(request, sender, sendResponse) {
  if (request.type === 'ping') {
    sendResponse({type: 'pong'});
  }
  else if (request.type === 'contextRequest') {
    sendResponse({type: 'context', context: getContext(request.site.context.dom)});
  }
};

chrome.runtime.onMessage.addListener(messageHandler);
