'use strict';

var should = require('should');

var sites = require('../assets/js/config/sites.js');

function testUrlsRegex(siteName) {
  var site = sites[siteName];
  describe(siteName, function() {
    var tests = site.tests;
    if(!tests || !tests.urls || !tests.urls.length) {
      it.skip('No URL tests for ' + siteName);
      return;
    }
    tests.urls.forEach(function(url) {
      it('should match "' + url + '"', function() {
        url.should.match(site.url);
      });
    });
    if(tests.nonMatchingUrls) {
      tests.nonMatchingUrls.forEach(function(url) {
        it('should not match "' + url + '"', function() {
          url.should.not.match(site.url);
        });
      });
    }
  });
}

function testTitlesRegex(siteName) {
  var site = sites[siteName];
  if(!site.context || !site.context.title) {
    return;
  }
  describe(siteName, function() {
    var tests = site.tests;
    if(!tests || !tests.titles) {
      it.skip('No Title tests for ' + siteName);
      return;
    }
    Object.keys(tests.titles).forEach(function(title) {
      site.context.forEach(function(context) {
        it('should match "' + title + '"', function() {
          title.should.match(context.title);

          var match = title.match(context.title);
          should(context).be.ok;
          match.shift(1);
          // Normalize the array for eql below (hacky hack)
          match = match.concat([]);
          match.should.eql(site.tests.titles[title]);
        });
      });
    });
  });
}

describe('<Context detection>', function() {
  describe('URL regex should match test urls', function() {
    Object.keys(sites).forEach(testUrlsRegex);
  });

  describe('Title regex should extract context items', function() {
    Object.keys(sites).forEach(testTitlesRegex);
  });
});
