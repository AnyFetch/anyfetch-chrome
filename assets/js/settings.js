'use strict';

var config = require('./config/index.js');
var checkToken = require('./helpers/check-token.js');

document.addEventListener('DOMContentLoaded', function() {
  var url = "https://manager.anyfetch.com/marketplace";

  document.getElementById('open-marketplace').addEventListener('click', function() {
    chrome.windows.create({
      url: url,
      type: 'popup',
      width: 800,
      height: 800
    }, null);
  });

  config.store.loadSettings(function() {
    checkToken(config.store.token, function(err) {
      if(err) {
        document.getElementById('login-btn').classList.remove('hidden');
      }
      else {
        if(config.store.email) {
          document.getElementById('open-marketplace').classList.remove('hidden');
          url = "https://manager.anyfetch.com/sign_in?redirection=%2Fmarketplace&email=" + config.store.email;
        }
      }
    });
  });
});
