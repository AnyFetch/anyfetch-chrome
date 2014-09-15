'use strict';

var should = require('should');

var detectContext = require('../assets/js/detect-context.js');

describe('<Context detection>', function() {
  var fakeName = 'Léo Hua--Döl';
  var testData = {
    'GitHub': {
      url: 'https://github.com/leoHD',
      title: 'leoHD (' + fakeName + ')'
    },
    'LinkedIn': {
      url: 'https://www.linkedin.com/profile/view?id=255575282',
      title: fakeName + ' | LinkedIn'
    }
  };

  it('should return false for non-supported sites', function(done) {
    var tab = {
    url: 'https://some.random.url/profile/view?id=32133742',
    title: fakeName + ' | My Random Site',
    };
    detectContext(tab, function(err, context) {
      should(context).not.be.ok;
      done(err);
    });
  });

  describe('should extract context query string on supported sites', function() {
    for(var siteName in testData) {
      var tab = testData[siteName];
      it(siteName, function(done) {
        detectContext(tab, function(err, context) {
          should(context).be.ok.and.equal(fakeName);
          done(err);
        });
      });
    }
  });
});
