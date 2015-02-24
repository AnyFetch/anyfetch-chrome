'use strict';

require('zepto/zepto.min.js');
require('./mixpanel');

var async = require('async/lib/async.js');
var config = require('./config/index.js');
var oauthStart = require('./oauth/oauth-start.js');
var checkToken = require('./helpers/check-token.js');

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

var showSuccess = function showSuccess(message) {
  message = message || 'You are now logged in!';
  showById('success');
  document.getElementById('success-message').innerHTML = message;

  window.mixpanel.identify(config.store.userId);
  window.mixpanel.track('Login', {
    email: config.store.email,
  });
  // The background page will catch this and reload contexts which might have some results
  chrome.runtime.sendMessage({
    type: 'anyfetch::backgroundLoginSuccessful',
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
    message.innerHTML = 'Error: ' + err.toString;
  }
};

var finalHandler = function finalHandler(err) {
  if(!err) {
    return showSuccess();
  }
  showError(err);
};

var buttonHandler = function oauthButtonHandler(cb) {
  document.getElementById('start-oauth').addEventListener('click', function() {
    showById('loader');
    oauthStart(cb, '/init/connect' + '?state=v2');
  });
  document.getElementById('start-register').addEventListener('click', function() {
    showById('loader');
    oauthStart(cb, '/init/register' + '?state=v2');
  });
};

document.addEventListener('DOMContentLoaded', function() {
  async.waterfall([
    function loadSettings(cb) {
      config.store.loadSettings(cb);
    },
    function checkUserToken(cb) {
      checkToken(config.store.token, function(err) {
        cb(null, !err);
      });
    },
    function registerHandler(ok, cb) {
      if(ok) {
        showSuccess('You are already logged in!');
        return;
      }
      showById('index');
      buttonHandler(cb);
    }
  ], finalHandler);
});
