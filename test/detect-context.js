'use strict';

var should = require('should');

var detectContext = require('../assets/js/popup/detect-context.js');

describe('<Context detection>', function() {
  var fakeName = 'Léo Hua--Döl';
  var fakeContext = { name: fakeName, active: true, hash: '1078456788' };
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

  it('should err for non-supported sites', function(done) {
    var tab = {
    url: 'https://some.random.url/profile/view?id=32133742',
    title: fakeName + ' | My Random Site',
    };
    detectContext(tab, function(err) {
      err.should.be.ok;
      done();
    });
  });

  describe('should extract context query string on supported sites', function() {
    Object.keys(testData).forEach(function(siteName) {
      it(siteName, function(done) {
        var tab = testData[siteName];
        detectContext(tab, function(err, context) {
          should(context).be.ok;
          should(context).containEql(fakeContext);
          done(err);
        });
      });
    });
  });
});
