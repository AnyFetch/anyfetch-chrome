'use strict';
/* This file is injected in the page to find the DOM element which matches the configuration */

var turnObjToArray = function(obj) {
  return [].map.call(obj, function(element) {
    return element;
  });
};

function getValue(rule) {
  var nodes = turnObjToArray(document.querySelectorAll(rule.selector));

  // For each matching node,
  // Find content removing empty and filtered values
  nodes = nodes.reduce(function(acc, node) {
    var value = '';
    if(rule.target === 'textContent') {
      value = node.textContent;
    }
    else if(rule.target === 'value') {
      value = node.value;
    }
    else {
      value = node.getAttribute(rule.target);
    }

    if(rule.filter && !new RegExp(rule.filter).test(value)) {
      value = null;
    }

    if(rule.selected === false) {
      value = "~" + value.trim();
    }

    if(value) {
      acc.push(value.trim());
    }
    return acc;
  }, []);
  return nodes;
}

function getContext(rules) {
  var values = [];
  rules.forEach(function(rule) {
    var value;
    if(Array.isArray(rule)) {
      // If the rule is an array of rules, we keep the first found
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

function inject(site, cb) {
  console.log('message');
  if(!site.injection) {
    return cb();
  }
  var iframe = document.createElement('iframe');
  iframe.setAttribute("src", chrome.extension.getURL(site.injection.path));
  document.querySelectorAll(site.injection.target)[0].appendChild(iframe);
  cb();
}

var messageHandler = function messageHandler(request, sender, sendResponse) {
  if(request.type === 'anyfetch::ping') {
    sendResponse({type: 'anyfetch::pong'});
  }
  else if(request.type === 'anyfetch::contextRequest') {
    sendResponse({type: 'context', context: getContext(request.site.context.dom)});
  }
  else if(request.type === 'anyfetch::injectRequest') {
    console.log('message');
    inject(request.site, function() {
      sendResponse({type: 'anyfetch::injected'});
    });
  }
};

chrome.runtime.onMessage.addListener(messageHandler);
