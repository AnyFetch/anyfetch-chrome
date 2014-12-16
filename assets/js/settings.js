'use strict';

var config = require('./config/index.js');
var checkToken = require('./helpers/check-token.js');

document.addEventListener('DOMContentLoaded', function() {
  config.loadUserSettings(function() {
    checkToken(config.token, function(err) {
      if(err) {
        document.getElementById('login-btn').classList.remove('hidden');
      }
    });
  });
});
