'use strict';

var Mustache = require('../../node_modules/mustache/mustache.js');
var templates = require('../templates/templates.js');

/**
 * Setting name => default value
 */
var settings = {
  token: {
    placeholder: '64 hexadecimal characters',
    default: '',
    label: 'Token'
  },
  apiUrl: {
    placeholder: 'https://api.anyfetch.com',
    default: 'https://api.anyfetch.com',
    label: 'AnyFetch API URL'
  },
  appUrl: {
    placeholder: 'https://app.anyfetch.com',
    default: 'https://app.anyfetch.com',
    label: 'AnyFetch app URL'
  }
};

var insertFields = function(descriptors) {
  var inputs = '';
  for(var id in descriptors) {
    var view = descriptors[id];
    view.id = id;
    console.log(view);
    inputs += Mustache.render(templates.settingsInput, view);
  }
  console.log(inputs);
  document.getElementById('settingsInputs').innerHTML = inputs;
};

var displayValues = function(values) {
  for(var id in values) {
    document.getElementById(id).value = values[id];
  }
};

/**
 * Load the current setting values
 * and fill in the form.
 */
var loadSettings = function() {
  // Fill in the overrided values only
  chrome.storage.sync.get(Object.keys(settings), displayValues);
};

var saveSettings = function() {
  var newValues = {};
  for(var id in settings) {
    newValues[id] = document.getElementById(id).value;
  }

  // Persist settings using the `chrome.storage` API
  chrome.storage.sync.set(newValues, function() {
    console.log('Settings updated.');
  });
};

/** Reset all settings do their default value */
var resetSettings = function() {
  chrome.storage.sync.clear(function() {
    var newValues = {};
    for(var id in settings) {
      newValues[id] = '';
    }
    displayValues(newValues);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  insertFields(settings);
  loadSettings();
  document.getElementById('save').addEventListener('click', saveSettings);
  document.getElementById('reset').addEventListener('click', resetSettings);
});
