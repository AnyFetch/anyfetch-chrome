"use strict";


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
    message: "Before getting results, you'll need to connect your accounts. Click here!",
    iconUrl: "/images/icons/extension/icon128.png",
    isClickable: true,
  };
  chrome.notifications.create(notificationId, options, function() {});

  chrome.notifications.onClicked.addListener(function(_notificationId) {
    if(notificationId === _notificationId) {
      lastClickedOnNoProviders = new Date();
      chrome.tabs.create({url: 'https://manager.anyfetch.com/marketplace'});
    }
  });

  // Remove from notification center
  setTimeout(function() {
    chrome.notifications.clear(notificationId, function() {});
  }, 30000);
};


