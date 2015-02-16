'use strict';

var async = require('async');

var Store = function Store(keys, defaults) {
  var self = this;
  self._cache = {};

  // State of internal cache compared to chrome async storage
  self._loaded = false;
  self._loading = false;
  // Used to pile up callbacks of settings loading
  self._loadedListeners = [];

  self._defaults = defaults;

  self._queue = async.queue(function(items, cb) {
    chrome.storage.sync.set(items, function() {
      if(chrome.runtime.lastError) {
        return cb(chrome.runtime.lastError);
      }
      setTimeout(cb, 1000);
    });
  }, 2);

  keys.forEach(function(key) {
    self.addProperty(key);
  });

  // Launch loading of settings from the chrome storage API
  self.loadSettings();

  chrome.storage.onChanged.addListener(function(changes, aeraName) {
    if(aeraName !== 'sync') {
      return;
    }
    Object.keys(changes).forEach(function(key) {
      self._cache[key] = changes[key].newValue;
    });
  });
};

Store.prototype.addProperty = function addProperty(key, value) {
  var self = this;
  if(value) {
    self._cache[key] = value;
  }
  Object.defineProperty(self, key, {
    enumerable: false,
    configurable: false,
    get: function() {
      if(!self._loaded) {
        throw new Error('Config not loaded yet (accessing ' + key + ')');
      }
      return self._cache[key];
    },
    set: function(value) {
      self._cache[key] = value;
      var items = {};
      items[key] = value;
      self._queue.push(items, function(err) {
        if(err) {
          console.err(err);
        }
      });
    }
  });
};

Store.prototype.loadSettings = function loadSettings(cb) {
  var self = this;
  if(self._loaded) {
    return cb();
  }
  if(cb) {
    self._loadedListeners.push(cb);
  }
  if(self._loading) {
    return;
  }
  self._loading = true;
  var keys = Object.keys(self._defaults);
  chrome.storage.sync.get(keys, function(values) {
    keys.forEach(function(key) {
      var value = values[key];
      if(value || value === false) {
        self._cache[key] = value;
      }
      else if(self._defaults) {
        self._cache[key] = self._defaults[key];
      }
    });
    self._loaded = true;
    self._loading = false;
    self._loadedListeners.forEach(function(cb) {
      cb(null);
    });
    self._loadedListeners = [];
  });
};

module.exports = Store;
