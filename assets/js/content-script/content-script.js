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

/**
 * Message listener used to check if the content script is injected
 */
var ping = function ping(request, sender, sendResponse) {
  sendResponse({});
};

/**
 * Message listener for injection requests
 */
var inject = function inject(request, sender, sendResponse) {
  var site = request.site;
  var injectionMethods = {
    prepend: function(target, elem) {
      target.insertBefore(elem, target.firstChild);
    },
    append: function(target, elem) {
      target.appendChild(elem);
    },
    replace: function(target, elem) {
      target.innerHTML = elem;
    }
  };

  if(document.getElementById('anyfetch-iframe')) {
    console.warn('Injection aborted (iframe looks already there)');
    return;
  }

  if(!site.injection || !injectionMethods[site.injection.type]) {
    console.warn('Injection aborted (no injection methods documented)');
    return;
  }

  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', chrome.extension.getURL(site.injection.path));
  iframe.setAttribute('id', 'anyfetch-iframe');
  iframe.setAttribute('frameBorder', 0);
  if(site.injection.width) {
    iframe.setAttribute('width', site.injection.width);
  }
  if(site.injection.height) {
    iframe.setAttribute('height', site.injection.height);
  }
  if(site.injection.style) {
    iframe.setAttribute('style', site.injection.style);
  }

  var retries = 5;
  (function tryInject(pause, current) {
    var target = document.querySelectorAll(site.injection.selector)[0];
    if(target) {
      injectionMethods[site.injection.type](target, iframe);
    }
    else if(current < retries) {
      setTimeout(tryInject, pause, pause * 2, current + 1);
    }
  })(200, 0);

  sendResponse();
};

/**
 * Message listener for context requests
 */
var getContext = function getContext(request, sender, sendResponse) {
  // TODO: implement retry here, this would be much cleaner
  var values = [];
  var rules = request.site && request.site.context && request.site.context.dom;
  if(!rules) {
    sendResponse({context: values});
    return;
  }
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
  sendResponse({context: values});
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
