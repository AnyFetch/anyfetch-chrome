"use strict";

var extensionId = chrome.i18n.getMessage('@@extension_id');

// Check if the extension is running in production
if(extensionId === 'igbnmifdfpgnbdhcnhiadcggoejocfpn') {
  /**
   * Creates a temporary global ga object and loads analytics.js.
   * Paramenters o, a, and m are all used internally. They could have been declared using 'var',
   * instead they are declared as parameters to save 4 bytes ('var ').
   *
   * @param {Window}      i The global context object.
   * @param {Document}    s The DOM document object.
   * @param {string}      o Must be 'script'.
   * @param {string}      g URL of the analytics.js script. Inherits protocol from page.
   * @param {string}      r Global name of analytics object.  Defaults to 'ga'.
   * @param {DOMElement?} a Async script tag.
   * @param {DOMElement?} m First script tag in document.
   */
  (function(i, s, o, g, r, a, m) {
    i.GoogleAnalyticsObject = r; // Acts as a pointer to support renaming.

    // Creates an initial ga() function. The queued commands will be executed once analytics.js loads.
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments);
    },

    // Sets the time (as an integer) this tag was executed. Used for timing hits.
    i[r].l = 1 * new Date();

    // Insert the script tag asynchronously. Inserts above current tag to prevent blocking in
    // addition to using the async attribute.
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');


  window.ga('create', 'UA-35597266-5', 'auto');
  // Required by the chrome extension (its protocol is chrome-extension:// so ti will wrongly guess the protocol)
  window.ga('set', 'checkProtocolTask', null);
  window.ga('set', 'forceSSL', true);
}
else {
  window.ga = function() {
    var args = Array.prototype.slice.call(arguments);
    args = args.map(function(arg) {
      return '"' + arg + '"';
    });
    console.log('ga(' + args.join(", ") + ');');
  };
}
