'use strict';

var Mustache = require('mustache');
var templates = require('../templates/templates.js');
var config = require('./config/index.js');


var insertFields = function(descriptors) {
  var inputs = '';
  for(var id in descriptors) {
    var view = descriptors[id];
    view.id = id;
    view.value = '';

    inputs += Mustache.render(templates.settingsInput, view);
  }
  document.getElementById('settingsInputs').innerHTML = inputs;
};


var displayValues = function(values) {
  Object.keys(values).forEach(function(id) {
    document.getElementById(id).value = config.store[id];
  });
};


/**
 * Load the current setting values
 * and fill in the form.
 */
var loadSettings = function() {
  // Fill in the overrided values only
  config.store.loadSettings(function() {
    displayValues(config.settings);
  });
};


var saveSettings = function(event) {
  var newValues = {};
  for(var id in config.settings) {
    var input = document.getElementById(id);
    newValues[id] = input.value;
    // Empty fields are filled with their default value
    if(!input.value) {
      input.value = config.defaults[id];
    }
  }


  // Persist settings using the `chrome.storage` API
  // (we don't use config.store since we have a lot of values to set)
  chrome.storage.sync.set(newValues, function() {
    console.log('Settings updated.');
    event.target.innerHTML = 'Saved!';
    window.setTimeout(function() {
      event.target.innerHTML = 'Save';
    }, 1000);
  });
};


/** Reset all settings to their default value */
var resetSettings = function(event) {
  var newValues = {};
  Object.keys(config.settings).forEach(function(key) {
    newValues[key] = config.defaults[key];
  });
  chrome.storage.sync.set(newValues, function() {
    console.log('Settings reset.');
    displayValues(newValues);
    event.target.innerHTML = 'Done!';
    window.setTimeout(function() {
      event.target.innerHTML = 'Reset';
    }, 1000);
  });
};


document.addEventListener('DOMContentLoaded', function() {
  insertFields(config.settings);
  loadSettings();
  document.getElementById('save').addEventListener('click', saveSettings);
  document.getElementById('reset').addEventListener('click', resetSettings);
  document.getElementById('settings').classList.remove('section-invisible');
});
