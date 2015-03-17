'use strict';
/* This file is injected in the page to find the DOM element which matches the configuration */

if(!document.documentElement.hasAttribute("data-anyfetch-injected")) {
  document.documentElement.setAttribute("data-anyfetch-injected", "true");
  (function() {
    var nodeListToArray = function nodeListToArray(obj) {
      return [].slice.call(obj);
    };

    var getValue = function getValue(rule) {
      var nodes = nodeListToArray(document.querySelectorAll(rule.dom.selector));

      // For each matching node,
      // Find content removing empty and filtered values
      nodes = nodes.reduce(function(acc, node) {
        var value = '';
        if(rule.dom.target === 'textContent') {
          value = node.textContent;
        }
        else if(rule.dom.target === 'value') {
          value = node.value;
        }
        else {
          value = node.getAttribute(rule.dom.target);
        }

        if(rule.filter && !(new RegExp(rule.filter)).test(value)) {
          value = null;
        }

        if(value) {
          acc.push(value.trim());
        }
        return acc;
      }, []);


      // Add rule's option to every context item
      nodes = nodes.map(function(node) {
        var item = {};
        item.value = node;
        item.quote = !!rule.quote;
        if(rule.active === false) {
          item.active = rule.active;
        }
        else {
          item.active = true;
        }
        return item;
      });

      return nodes;
    };

    var retry = function retry(retries, pause, func) {
      // If the function returns true, stop retrying
      if(func()) {
        return;
      }
      if(retries) {
        setTimeout(retry, pause, retries - 1, pause * 2, func);
      }
    };

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

      var onloadIframe = function(target) {
        return function() {
          var self = this;

          var iframes = document.querySelectorAll(site.injection.selector + ' > #anyfetch-iframe');
          if(iframes.length > 1) {
            nodeListToArray(iframes).forEach(function(elem) {
              if(elem === iframe) {
                elem.remove(); // Non standard, only supported in Chrome (but we are in a chrome extension!)
              }
            });
          }

          // Adjust iframe height to fill available height, taking into account existing elements
          //
          // Currently only working for gmail, so be careful with that.
          //
          // Watch for size changes during some time to adjust height of the iframe
          // Useful for rapportive for example, which may expand it's height after loading
          // some results.
          var previousSize = 0;
          var adjustSize = function adjustSize() {
            var size = 0;
            nodeListToArray(target.children).forEach(function(elem) {
              if(elem.id !== 'anyfetch-iframe') {
                size += elem.clientHeight;
              }
            });

            // Find the inner height of the content (the results) of the iframe.
            var contentDiv;
            if(self.contentWindow) {
              contentDiv = self.contentWindow.document.getElementById('content');
            }

            // We can now find out if the iframe is scrollable (i.e. lots of results), and if we should expand the
            // frame to maximum available height.
            if(contentDiv && contentDiv.scrollHeight === contentDiv.clientHeight) {
              // Not overflowing
              size = self.contentWindow.document.documentElement.clientHeight;
              // Remove overflowing class
              contentDiv.classList.toggle('overflowing', false);
            }
            else {
              size = document.documentElement.clientHeight - 200 - size; // 200 ~= size of gmail header
              // Add overflowing class
              contentDiv.classList.toggle('overflowing', true);
            }
            size = size < 400 ? 400 : size; // Minimum size of 400
            if(!previousSize || Math.abs(previousSize - size) > 50) { // 50 = threshold for resizing
              self.height = size;
              previousSize = size;
            }
            return false; // continue retrying
          };
          retry(5, 400, adjustSize);
        };
      };

      if(!site.injection || !injectionMethods[site.injection.type]) {
        console.warn('Injection aborted (no documented injection method)');
        return;
      }

      // Try to remove any other iframe that we may have injected before
      // This should fix the double inclusion bug
      var iframes = document.querySelectorAll(site.injection.selector + ' > #anyfetch-iframe');
      if(iframes.length) {
        console.warn('Prevented double injection');
        return;
      }

      if(this.injectedHref && this.injectedHref === document.location.href) {
        console.warn('Prevented double injection');
        return;
      }
      this.injectedHref = document.location.href;

      var iframe = document.createElement('iframe');
      iframe.setAttribute('src', chrome.extension.getURL(site.injection.path));
      iframe.setAttribute('id', 'anyfetch-iframe');
      iframe.setAttribute('class', 'anyfetch-iframe');
      iframe.setAttribute('frameBorder', 0);
      iframe.setAttribute('style', 'transition: height 0.5s;');
      if(site.injection.width) {
        iframe.setAttribute('width', site.injection.width);
      }
      if(site.injection.height) {
        iframe.setAttribute('height', site.injection.height);
      }
      if(site.injection.style) {
        iframe.setAttribute('style', site.injection.style);
      }

      var tryInject = function tryInject() {
        var target = document.querySelector(site.injection.selector);
        if(target) {
          iframe.onload = onloadIframe(target);
          injectionMethods[site.injection.type](target, iframe);
          return true; // we should be good, stop retrying
        }
        return false;
      };
      retry(5, 200, tryInject);

      sendResponse();
    };

    /**
     * Message listener for context requests
     */
    var getContext = function getContext(request, sender, sendResponse) {
      var execGetContext = function execGetContext() {
        var values = [];
        var rules = request.site && request.site.context;
        if(!rules) {
          sendResponse({context: []});
          return;
        }

        var appendValue = function appendValue(rule) {
          var value = getValue(rule);
          if(value.length) {
            values = values.concat(value);
            return true;
          }
          return false;
        };

        rules.forEach(function(rule) {
          if(!rule.dom) {
            return;
          }
          if(Array.isArray(rule)) {
            // If the rule is an array of rules, we keep the first matching a context
            rule.some(appendValue);
          }
          else {
            appendValue(rule);
          }
        });
        if(!values.length) {
          return false; // retry
        }
        sendResponse({context: values});
        return true; // stop retrying
      };

      retry(3, 250, execGetContext); // 0ms, 250ms, 500ms, 1000ms = ~1.7s;
      return true; // let chrome know this is asynchronous
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
  }());
}

