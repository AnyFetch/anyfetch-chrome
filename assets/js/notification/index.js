"use strict";
var config = require('../config/');
require('../mixpanel.js');

var lastShownNotLogged = new Date(0);

/**
 * Display a notification explaining you're not logged yet,
 * Clicking on it will open the authentication page.
 */
module.exports.displayNotLogged = function notLoggedNotification(site) {
  if(new Date() - lastShownNotLogged < 1000 * 60 * 60 * 24) { // 24h
    // Don't display notification again if user already clicked on it
    console.log("Cooldown for not logged in notification.");
    return;
  }

  var notificationId = "not_logged-" + site.name + '-' + new Date().getTime();
  var options = {
    type: "basic",
    title: "Setup AnyFetch!",
    message: "Click to sign-in and start using AnyFetch on " + site.name + "!",
    iconUrl: "/images/icons/extension/icon128.png",
    isClickable: true,
  };
  chrome.notifications.create(notificationId, options, function() {});
  // Show again in 1h if we are still not logged in
  lastShownNotLogged = new Date(new Date().getTime() - 1000 * 60 * 60 * 23); // 23h ago

  chrome.notifications.onClicked.addListener(function(_notificationId) {
    if(notificationId === _notificationId) {
      lastShownNotLogged = new Date();
      chrome.tabs.create({url: '/first-run.html'});
    }
  });

  // Remove from notification center
  setTimeout(function() {
    chrome.notifications.clear(notificationId, function() {});
  }, 30000);
};


var lastShownNoProviders = new Date(0);

/**
 * Display a notification explaining you don't have any provider connected yet.
 * Clicking on it will open the manager.
 */
module.exports.displayNoProviders = function noProvidersNotification() {
  if(new Date() - lastShownNoProviders < 1000 * 60 * 60 * 24) { // 24h
    // Don't display notification again if user already clicked on it
    console.log("Cooldown for marketplace notification.");
    return;
  }

  var notificationId = "no-providers-" + new Date().getTime();
  var options = {
    type: "basic",
    title: "Add accounts to your AnyFetch!",
    message: "Click here to finish the setup.",
    iconUrl: "/images/icons/extension/icon128.png",
    isClickable: true,
  };
  chrome.notifications.create(notificationId, options, function() {});
  lastShownNoProviders = new Date();

  chrome.notifications.onClicked.addListener(function(_notificationId) {
    if(notificationId === _notificationId) {
      // Show again in 15 minutes if still no providers
      lastShownNoProviders = new Date(new Date().getTime() - 1000 * 60 * 60 * 23.75); // 23h45 ago
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


