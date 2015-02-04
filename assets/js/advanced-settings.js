'use strict';

var Mustache = require('mustache');
var templates = require('../templates/templates.js');
var config = require('./config/index.js');


var insertFields = function(descriptors) {
  var inputs = '';
  for(var id in descriptors) {
    var view = descriptors[id];
    view.id = id;
    view.value = view.default;

    inputs += Mustache.render(templates.settingsInput, view);
  }
  document.getElementById('settingsInputs').innerHTML = inputs;
};


var displayValues = function(values) {
  Object.keys(values).forEach(function(id) {
    document.getElementById(id).value = values[id];
  });
};


/**
 * Load the current setting values
 * and fill in the form.
 */
var loadSettings = function() {
  // Fill in the overrided values only
  chrome.storage.sync.get(Object.keys(config.settings), displayValues);
};


var saveSettings = function(event) {
  var newValues = {};
  for(var id in config.settings) {
    var input = document.getElementById(id);
    newValues[id] = input.value;
    // Empty fields are filled with their default value
    if(!input.value) {
      input.value = config.settings[id].default;
    }
  }


  // Persist settings using the `chrome.storage` API
  chrome.storage.sync.set(newValues, function() {
    console.log('Settings updated.');
    event.target.innerHTML = 'Saved!';
    window.setTimeout(function() {
      event.target.innerHTML = 'Save';
    }, 1000);
  });
};


/** Reset all settings to their default value */
var resetSettings = function() {
  chrome.storage.sync.clear(function() {
    var newValues = {};
    Object.keys(config.settings).forEach(function(id) {
      newValues[id] = config.settings[id].default;
    });
    displayValues(newValues);
  });
};


document.addEventListener('DOMContentLoaded', function() {
  insertFields(config.settings);
  loadSettings();
  document.getElementById('save').addEventListener('click', saveSettings);
  document.getElementById('reset').addEventListener('click', resetSettings);
  document.getElementById('settings').classList.remove('section-invisible');
});
