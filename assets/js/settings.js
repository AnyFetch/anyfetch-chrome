'use strict';

var config = require('./config/index.js');
var checkToken = require('./helpers/check-token.js');

document.addEventListener('DOMContentLoaded', function() {
  config.store.loadSettings(function() {
    checkToken(config.store.token, function(err) {
      if(err) {
        document.getElementById('login-btn').classList.remove('hidden');
      }
      if(config.store.email) {
      	document.getElementById('open-marketplace').href = "https://manager.anyfetch.com/sign_in?redirection=%2Fmarketplace&email=" + config.store.email;
      }
    });
  });
});
