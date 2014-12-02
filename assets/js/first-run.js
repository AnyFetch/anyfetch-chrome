'use strict';

require('zepto/zepto.min.js');
var async = require('async/lib/async.js');
var getStatus = require('./fetch/get-status.js');
var config = require('./config/configuration.js');
var oauthStart = require('./oauth/oauth-start.js');

var showById = function showById(id) {
  var ids = ['error', 'success', 'loader', 'index'];
  var element;

  var toShow = document.getElementById(id);
  if(!toShow) {
    return;
  }

  var toHide = ids.filter(function(itemId) {
    return itemId !== id;
  });

  toHide.forEach(function(itemId) {
    element = document.getElementById(itemId);
    if(element) {
      element.classList.add('hidden');
    }
  });
  toShow.classList.remove('hidden');
};

var showSuccess = function showSuccess() {
  showById('success');
  var close = document.getElementById('close-tab');
  close.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.remove(tabs[0].id);
    });
  });
};

var showError = function showError(err) {
  showById('error');
  var message = document.getElementById('error-message');
  var action = document.getElementById('action');
  if(err.message === 'Canceled by user') {
    message.innerHTML = 'The authorization process was canceled';
    action.classList.remove('hidden');
    action.addEventListener('click', function() {
      window.location.reload();
    });
  }
  else {
    message.innerHTML('Error: ' + err.toString);
  }
};

var finalHandler = function finalHandler(err) {
  if(!err) {
    return showSuccess();
  }
  showError(err);
};

var oauthButtonHandler = function oauthButtonHandler() {
  document.getElementById('start-oauth').addEventListener('click', function() {
    showById('loader');
    oauthStart(finalHandler);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  async.waterfall([
    function loadSettings(cb) {
      config.loadUserSettings(cb);
    },
    function checkToken(cb) {
      // token already stored ?
      if(config.token) {
        getStatus(function(err) {
          if(err) {
            return cb(null, false);
          }
          cb(null, true);
        });
      }
      else {
        cb(null, false);
      }
    },
    function registerHandler(ok, cb) {
      if(ok) {
        showSuccess();
        return cb();
      }
      showById('index');
      oauthButtonHandler();
    }
  ], finalHandler);
});
