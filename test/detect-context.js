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

  it('should return false for non-supported sites', function() {
    var url = 'https://some.random.url/profile/view?id=32133742';
    var title = fakeName + ' | My Random Site';
    should(detectContext(url, title)).not.be.ok;
  });

  describe('should extract context query string on supported sites', function() {
    for(var siteName in testData) {
      var site = testData[siteName];
      it(siteName, function() {
        var context = detectContext(site.url, site.title);
        should(context).be.ok.and.equal(fakeName);
      });
    }
  });
});
