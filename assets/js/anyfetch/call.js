'use strict';

require('zepto/zepto.min.js');
var config = require('../config/index.js');

module.exports = function call(options, cb) {
  if(!config.token) {
    return cb(new Error('No token in config object while trying to call AnyFetch API'));
  }

  var ajaxOptions = {
    headers: {
      'Authorization': 'Bearer ' + config.token,
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