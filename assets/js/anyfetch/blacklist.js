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

var getUserName = function(cb) {
  async.waterfall([
    function getName(cb) {
      var options = {
        url: config.store.apiUrl + '/',
      };
      call.httpRequest(options, cb);
    },
    function parseUserName(body, cb) {
      cb(null, body.user_name);
    }
  ], cb);
};

var updateBlacklist = function(cb) {
  async.waterfall([
    getUserName,
    function blacklistUserName(userName, cb) {
      config.store.blacklist[userName.toLowerCase()] = true;
      cb();
    },
    function retrieveAccouts(cb) {
      getAccounts(config.store.email, cb);
    },
    function blacklistAccoutns(accounts, providers, cb) {
      getWords(accounts).forEach(function(word) {
        config.store.blacklist[word.toLowerCase()] = true;
      });

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
    if(config.store.blacklist[item.name.toLowerCase()]) {
      item.active = false;
    }

    // Items starting with '~' should be disabled by default
    if(item.name[0] === '~') {
      item.active = false;
      item.name = item.name.substr(1);
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
