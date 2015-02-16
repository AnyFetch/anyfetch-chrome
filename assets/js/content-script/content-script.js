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

/**
 * Message listener used to check if the content script is injected
 */
var ping = function ping(request, sender, sendResponse) {
  sendResponse();
};

/**
 * Message listener for injection requests
 */
var inject = function inject(request, sender, sendResponse) {
  var site = request.site;
  var injectionMethods = {
    prepend: function(target, elem) {
      target.parentNode.insertBefore(elem, target.firstChild);
    },
    append: function(target, elem) {
      target.appendChild(elem);
    },
    replace: function(target, elem) {
      target.innerHTML = elem;
    }
  };

  if(!site.injection || !injectionMethods[site.injection.type]) {
    console.warn('Injection aborted (no injection methods documented)');
    return;
  }

  var iframe = document.createElement('iframe');
  var target = document.querySelectorAll(site.injection.target)[0];
  iframe.setAttribute('src', chrome.extension.getURL(site.injection.path));
  iframe.setAttribute('frameBorder', 0);
  injectionMethods[site.injection.type](target, iframe);
  sendResponse();
};

/**
 * Message listener for context requests
 */
var getContext = function getContext(request, sender, sendResponse) {
  sendResponse({context: getContext(request.site.context.dom)});
};


/**
 * Message handler for inter instance messaging
 */
chrome.runtime.onMessage.addListener(function messageHandler(request, sender, sendResponse) {
  var handlers = {
    'anyfetch::csPing': ping,
    'anyfetch::csGetContext': getContext,
    'anyfetch::csInject': inject,
  };
  if(request.type && handlers[request.type]) {
    // return to chrome while explicitly casting to boolean
    return !!handlers[request.type](request, sender, sendResponse);
  }
  return false;
});
