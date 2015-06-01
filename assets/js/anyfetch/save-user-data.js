'use strict';

var config = require('../config/index.js');
var call = require('./call.js');
var updateBlacklist = require('./blacklist').updateBlacklist;

/**
 * Request the AnyFetch API for the user email, by calling the root endpoint, and save the result on chrome storage.
 * @param {Function} cb(err, data) [result from a call on /]
 */
module.exports = function saveUserData(cb) {
  var options = {
    url: config.store.apiUrl + '/',
  };

  call.httpRequest(options, function(err, indexPage) {
    if(err) {
      return cb(err);
    }
    // Store on config
    config.store.email = indexPage.user_email;
    config.store.userName = indexPage.user_name;
    config.store.userId = indexPage.user_id;
    config.store.companyId = indexPage.company_id;

    // Send to mixpanel
    window.mixpanel.people.set({
      '$email': config.store.email,
      // Update mixpanel too ?
      '$name': config.store.email,
      'userId': config.store.userId,
      'companyId': config.store.companyId,
      '$last_login': new Date(),
      'App Version': chrome.runtime.getManifest().version
    });

    // Only set created once
    window.mixpanel.people.set_once({
      '$created': new Date()
    });

    updateBlacklist(cb);
  });
};

