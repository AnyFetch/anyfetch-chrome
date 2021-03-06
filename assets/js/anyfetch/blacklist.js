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
    if(account === '') {
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
        url: config.store.apiUrl + '/documents?fields=facets.providers',
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

var updateBlacklist = function(cb) {
  async.waterfall([
    function retrieveAccounts(cb) {
      getAccounts(config.store.email, cb);
    },
    function blacklistAccoutns(accounts, providers, cb) {
      getWords(accounts).forEach(function(word) {
        config.store.blacklist[word.toLowerCase()] = true;
      });
      config.store.blacklist[config.store.userName.toLowerCase()] = true;

      config.store.providerCount = providers.length;
      // We modified internal properties of `blacklist`, so we call forceSync
      config.store.forceSync(cb);
    }
  ], cb);
};


/**
 * Takes an array for input and deactivate blacklisted items
 */
var filterQuery = function(context) {
  context.forEach(function(item) {
    // Remove items in blacklist
    if(config.store.blacklist[item.value.toLowerCase()]) {
      item.active = false;
    }
  });

  return context;
};

module.exports = {
  getWords: getWords,
  getAccounts: getAccounts,
  updateBlacklist: updateBlacklist,
  filterQuery: filterQuery,
};
