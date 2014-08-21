'use strict';

// TODO: generate input fields directly from a descriptor object

/**
 * Load the current setting values
 * and fill in the form.
 */
var loadSettings = function() {
  chrome.storage.sync.get({
    token: 'default'
  }, function(items) {
    document.getElementById('token').value = items.token;
  });
};

var saveSettings = function() {
  // Persist settings using the `chrome.storage` API
  chrome.storage.sync.set({
    token: document.getElementById('token').value
  }, function() {
    console.log('Updated settings.');
  });
};

/** Reset all settings do their default value */
var resetSettings = function() {
  // TODO
};

document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  document.getElementById('save').addEventListener('click', saveSettings);
  document.getElementById('reset').addEventListener('click', resetSettings);
});
