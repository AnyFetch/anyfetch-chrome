"use strict";
var config = require('../config/');
require('../mixpanel.js');

/**
 * Display a notification explaining you're not logged yet,
 * Clicking on it will open the authentication page.
 */
module.exports.displayNotLogged = function notLoggedNotification(site) {
  var notificationId = "not_logged-" + site.name;
  var options = {
    type: "basic",
    title: "Setup AnyFetch!",
    message: "Click to sign-in and start using AnyFetch on " + site.name + "!",
    iconUrl: "/images/icons/extension/icon128.png",
    isClickable: true,
  };
  chrome.notifications.create(notificationId, options, function() {});

  chrome.notifications.onClicked.addListener(function(_notificationId) {
    if(notificationId === _notificationId) {
      chrome.tabs.create({url: '/first-run.html'});
    }
  });

  // Remove from notification center
  setTimeout(function() {
    chrome.notifications.clear(notificationId, function() {});
  }, 30000);
};


var lastClickedOnNoProviders = new Date(0);

/**
 * Display a notification explaining you're not logged yet,
 * Clicking on it will open the authentication page.
 */
module.exports.displayNoProviders = function noProvidersNotification() {
  if(new Date() - lastClickedOnNoProviders < 1000 * 60 * 15) {
    // Don't display notification again if user already clicked on it
    console.log("Cooldown for marketplace notification.");
    return;
  }

  var notificationId = "no-providers";
  var options = {
    type: "basic",
    title: "Add accounts to your AnyFetch!",
    message: "Click here to finish the setup.",
    iconUrl: "/images/icons/extension/icon128.png",
    isClickable: true,
  };
  chrome.notifications.create(notificationId, options, function() {});

  chrome.notifications.onClicked.addListener(function(_notificationId) {
    if(notificationId === _notificationId) {
      lastClickedOnNoProviders = new Date();
      config.store.loadSettings(function() {
        var email = '';
        if(config.store.email) {
          email = '&email=' + config.store.email;
        }
        chrome.tabs.create({url: 'https://manager.anyfetch.com/sign_in?redirection=%2Fmarketplace' + email});

        window.mixpanel.identify(config.store.userId);
        window.mixpanel.track("Open marketplace", {
          email: config.store.email,
          origin: "notification"
        });
      });
    }
  });

  // Remove from notification center
  setTimeout(function() {
    chrome.notifications.clear(notificationId, function() {});
  }, 30000);
};


