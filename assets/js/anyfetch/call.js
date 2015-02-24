'use strict';

var config = require('../config/index.js');

module.exports.httpRequest = function httpRequest(options, cb) {
  // We require zepto here cause it crashes our test suite. In tests, we mock this function so there is no problem.
  require('zepto/zepto.min.js');
  if(!config.store.token) {
    return cb(new Error('No token in config object while trying to call AnyFetch API'));
  }

  var ajaxOptions = {
    headers: {
      'Authorization': 'Bearer ' + config.store.token,
    },
    contentType: 'application/json',
    dataType: 'json',
    success: function(data) {
      cb(null, data);
    },
    error: function(xhr, type) {
      if(type === 'timeout') {
        return cb(new Error('The action timed out. You may try again :('));
      }
      else if(type === 'error') {
        var json;
        try {
          json = JSON.parse(xhr.responseText);
        }
        catch(e) {
          return cb(new Error('Unknown network error (' + xhr.responseText + ')'));
        }
        if(json.code && json.message) {
          return cb(new Error(json.code + ': ' + json.message));
        }
        return cb(new Error('Unknown network error (' + xhr.responseText + ')'));
      }
    },
    timeout: 20 * 1000, // 20s
  };

  ajaxOptions = $.extend(ajaxOptions, options);
  $.ajax(ajaxOptions);
};
