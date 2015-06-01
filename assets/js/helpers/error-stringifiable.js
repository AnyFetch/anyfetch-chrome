'use strict';

/**
 * Enable errors to be JSON.stringified to enable error passing through Chrome's messaging
 * (which uses JSON.stringify)
 */
Object.defineProperty(Error.prototype, 'toJSON', {
  value: function() {
    var alt = {};

    Object.getOwnPropertyNames(this).forEach(function(key) {
      alt[key] = this[key];
    }, this);

    return alt;
  },
  configurable: true
});
