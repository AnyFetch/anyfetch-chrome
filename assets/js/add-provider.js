'use strict';

var async = require('async/lib/async.js');
var Mustache = require('mustache');

var templates = require('../templates/templates.js');
var getMarketplace = require('./fetch/get-marketplace.js');
var getProviders = require('./fetch/get-providers.js');
var config = require('./configuration.js');


async.waterfall([
  function loadSettings(cb) {
    // Load the user settings to check retrieve the token
    config.loadUserSettings(cb);
  },
  function callGetMarketplace(cb) {
    getMarketplace(cb);
  },
  function callGetProviders(clients, cb) {
    getProviders(function(err, providers) {
      cb(err, clients, providers);
    });
  },
  function displayMarketPlace(clients, providers, cb) {
    var html = '';
    clients.forEach(function(client) {
      var return_to = encodeURIComponent(chrome.extension.getURL('views/provider-callback.html') + '?state=success&client=' + client.name);
      var view = {
        name: client.name,
        description: client.description,
        url: config.managerUrl + '/connect/' + client.id + '?return_to=' + return_to,
        tokens: '',
      };
      providers.forEach(function(provider) {
        if(provider.client && client.id === provider.client.id) {
          view.tokens += Mustache.render(templates.token, {account_name: provider.account_name});
        }
      });
      html += Mustache.render(templates.provider, view);
    });
    document.getElementById('providers').innerHTML = html;
    cb();
  }
]);
