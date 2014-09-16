'use strict';

require('zepto/zepto.min.js');
var config = require('../configuration.js');

/**
 * Request the manager Marketplace
 * @param {Function} cb(err)
 */
module.exports = function getStatus(cb) {
  var url = config.managerUrl + '/marketplace.json';

  $.ajax({
    url: url,
    success: function(res) {
      cb(null, res);
    },
    error: function(res) {
      cb(res);
    }
  });
};
