'use strict';

require('should');
var sinon = require('sinon');
var blacklist = require('../assets/js/anyfetch/blacklist');
var call = require('../assets/js/anyfetch/call');

describe('Add names and accounts to blacklist:', function() {
  describe('getWords', function() {
    it('should transform accounts into blacklisted words', function(done) {
      var accounts = [
        'lol.mdr@anyfetch.com',
        'lolIsBetterThanMdr',
        'lol@',
        'lol.mdr+spam@anyfetch.com',
        'lol-rolf.mdr@anyfetch.com',
        '',
      ];
      blacklist.getWords(accounts).should.eql([
        'lol.mdr@anyfetch.com',
        'lol mdr',
        'lolisbetterthanmdr',
        'lolisbetterthanmdr',
        'lol@',
        'lol@',
        'lol.mdr+spam@anyfetch.com',
        'lol mdr',
        'lol-rolf.mdr@anyfetch.com',
        'lol rolf mdr'
      ]);
      done();
    });
  });

  describe('getAccounts', function() {
    it('should get all accounts', function(done) {
      var stub = sinon.stub(call, 'httpRequest', function(options, cb) {
        cb(null, require('./provider-response.json'));
      });
      blacklist.getAccounts('randomUser@anyfetch.com', function(err, accounts) {
        accounts.should.eql([
          'randomUser@anyfetch.com',
          'anyfetch.test2@gmail.com',
          'hugo.duroux@gmail.com',
          'hugo.duroux@gmail.com',
          'amoki'
        ]);
        stub.restore();
        done();
      });
    });
  });
});
