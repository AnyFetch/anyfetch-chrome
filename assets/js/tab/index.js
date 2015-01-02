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
