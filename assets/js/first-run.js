'use strict';

require('zepto/zepto.min.js');
var async = require('async/lib/async.js');
var getToken = require('./fetch/get-token.js');
var getStatus = require('./fetch/get-status.js');
var config = require('./configuration.js');

var displayError = function(err) {
  console.log(err);
  if(err.status === 401) {
    // 401, invalid credentials: show failed login error
    var form = document.getElementById('login-form');
    form.classList.add('has-error');
  }
};

var showSuccess = function() {
  var success = document.getElementById('success');
  var index = document.getElementById('index');
  index.classList.add('hidden');
  success.classList.remove('hidden');
};

var showForm = function() {
  var index = document.getElementById('index');
  index.classList.remove('hidden');
};

var formListener = function(e) {
  e.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  async.waterfall([
    function callGetToken(cb) {
      // Retrieve the user token by signing in with given credentials
      getToken(email, password, cb);
    },
    function saveToken(token, cb) {
      chrome.storage.sync.set({token: token}, cb);
    },
    function success(cb) {
      showSuccess();
      cb();
    }
  ], function(err) {
    if(err.status) {
      displayError(err);
    }
  });
  return false;
};

document.addEventListener('DOMContentLoaded', function() {
  async.waterfall([
    function loadSettings(cb) {
      config.loadUserSettings(cb);
    },
    function checkToken(cb) {
      // Check the stored token, if it is not valid/absent, show the sign-in form, else show success
      getStatus(function(err) {
        if(err) {
          return cb();
        }
        showSuccess();
      });
    },
    function setListener(cb) {
      showForm();
      var form = document.getElementById('login-form');
      form.addEventListener('submit', formListener);
      cb();
    }
  ]);
});
