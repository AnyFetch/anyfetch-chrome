'use strict';

var async = require('async');
var config = require('../config/index.js');
var call = require('./call.js');
var updateBlacklist = require('./blacklist').updateBlacklist;

/**
 * Request the AnyFetch API for the user email, by calling the root endpoint, and save the result on chrome storage.
 * @param {Function} cb(err, data) [result from a call on /]
 */
module.exports = function saveUserData(cb) {
  var options = {
    url: config.apiUrl + '/',
  };

  call.httpRequest(options, function(err, indexPage) {
    // Store on config
    config.email = indexPage.user_email;
    config.userId = indexPage.user_id;
    config.companyId = indexPage.company_id;

    // Send to mixpanel
    window.mixpanel.people.set({
      "$email": config.email,
      "$name": config.email,
      "userId": config.userId,
      "companyId": config.companyId,
      "$last_login": new Date(),
      "App Version": chrome.runtime.getManifest().version
    });

    // Only set created once
    window.mixpanel.people.set_once({
      "$created": new Date()
    });

    async.waterfall([
      function saveData(cb) {
        chrome.storage.sync.set({
          email: config.email,
          userId: config.userId,
          companyId: config.companyId,
          providerCount: config.providerCount
        }, cb);
      },
      function saveBlacklist(cb) {
        updateBlacklist(indexPage.user_email, cb);
      }
    ], cb);
  });
};

