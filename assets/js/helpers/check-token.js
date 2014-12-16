'use strict';

var getStatus = require('../anyfetch/get-status.js');

module.exports = function checkToken(token, cb) {
  if(token) {
    getStatus(function(err) {
      if(err) {
        return cb(new Error('This token is invalid'));
      }
      cb(null, token);
    });
  }
  else {
    cb(new Error('This token is invalid'));
  }
};
