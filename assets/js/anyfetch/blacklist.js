'use strict';

var async = require('async');
var validator = require('validator');
var config = require('../config/index.js');
var call = require('./call.js');

/*
 * Convert account email into first name and last name. ex: alice.bob@gmail.com into "alice bob"
 */
var getWords = function(accounts) {
  var formattedAccounts = [];
  accounts.forEach(function(account) {
    if(account === "") {
      return;
    }
    account = account.toLowerCase();

    // Push the original account
    formattedAccounts.push(account);

    // Format name
    if(validator.isEmail(account)) {
      account = account.split('@')[0];
      // Skip element that are after the + selector in some mail services
      account = account.split('+')[0];
    }
    account = account.replace('.', ' ', 'g');
    account = account.replace('-', ' ', 'g');

    // Push the formatted name
    formattedAccounts.push(account);
  });
  return formattedAccounts;
};

var getAccounts = function(userEmail, cb) {
  async.waterfall([
    function getProviders(cb) {
      var options = {
        url: config.apiUrl + '/documents?fields=facets.providers',
      };
      call.httpRequest(options, cb);
    },
    function getAccountNames(body, cb) {
      var accountNames = [userEmail];
      var providers = body.facets.providers;
      providers.forEach(function(provider) {
        if(provider.account_name) {
          accountNames.push(provider.account_name);
        }
      });
      cb(null, accountNames, providers);
    }
  ], cb);
};

var updateBlacklist = function(userEmail, cb) {
  getAccounts(userEmail, function(err, accounts, providers) {
    if(err) {
      return cb(err);
    }
    getWords(accounts).forEach(function(word) {
      config.blacklist[word] = true;
    });

    config.providerCount = providers.length;
    chrome.storage.sync.set({blacklist: config.blacklist}, cb);
  });
};

module.exports = {
  getWords: getWords,
  getAccounts: getAccounts,
  updateBlacklist: updateBlacklist
};
