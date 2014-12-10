"use strict";

/**
 * Get the matched site from the tab object
 * @param  {Object} sites Object from config.supportedSites
 * @param  {Object} tab https://developer.chrome.com/extensions/tabs#type-Tab
 * @return {Object} result The matched site, or null
 */
module.exports = function getSiteFromTab(sites, tab) {
  var site = null;

  Object.keys(sites).some(function(siteName) {
    if(tab.url.match(sites[siteName].url)) {
      site = sites[siteName];
      return true;
    }
    return false;
  });
  return site;
};
