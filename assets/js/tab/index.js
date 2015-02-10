"use strict";


/**
 * Enable or disable (blue / grey) the anyfetch extension icon on specifed tabId
 */
module.exports.activateExtension = function(tabId, activate) {
  // Force cast to boolean
  activate = !!activate;

  var iconsSet = {
    true: {
      '19': '/images/icons/extension/page-action/icon19.png',
      '38': '/images/icons/extension/page-action/icon38.png'
    },
    false: {
      '19': '/images/icons/extension/page-action/icon19_grayscale.png',
      '38': '/images/icons/extension/page-action/icon38_grayscale.png'
    }
  };

  chrome.pageAction.setIcon({
    tabId: tabId,
    path: iconsSet[activate]
  });
};


/**
 * Hide the extension from this tab
 */
module.exports.hideExtension = function(tabId) {
  chrome.pageAction.hide(tabId);
};


/**
 * Show the extension on this tab.
 * Customize the icon with `activateExtension()`
 */
module.exports.showExtension = function(tabId) {
  chrome.pageAction.show(tabId);
};


/**
 * set the pageAction's title for the target tab
 */
module.exports.setTitle = function(tabId, title) {
  chrome.pageAction.setTitle({
    tabId: tabId,
    title: title
  });
};


/**
 * Inject content to the target tab
 * @param {int} tabId The target tab id (required)
 * @param {site} site The detected site associated with the tab (required)
 */
module.exports.inject = function(tabId, site) {
  console.log(site);
  if(site.injection) {
    chrome.tabs.sendMessage(tabId, {
      type: 'anyfetch::injectRequest',
      site: site
    });
  }
};
