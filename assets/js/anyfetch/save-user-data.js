'use strict';

var config = require('../config/index.js');
var call = require('./call.js');

/**
 * Request the AnyFetch API for the user email, by calling the root endpoint, and save the result on chrome storage.
 * @param {Function} cb(err, data) [result from a call on /]
 */
module.exports = function saveUserData(cb) {
  var options = {
    url: config.apiUrl + '/',
  };

  call(options, function(err, body) {
    // Store on config
    config.email = body.user_email;
    config.userId = body.user_id;
    config.companyId = body.company_id;

    // Send to mixpanel
    window.mixpanel.people.set({
      "$email": config.email,
      "$name": config.email,
      "userId": config.userId,
      "companyId": config.companyId,
    });

    // Only set created once
    window.mixpanel.people.set_once({
      "$created": new Date()
    });

    // Store on storage
    chrome.storage.sync.set({
      email: body.user_email,
      userId: body.user_id,
      companyId: body.company_id,
    }, cb);
  });
};

