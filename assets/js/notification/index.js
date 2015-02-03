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

  setTimeout(function() {
    chrome.notifications.clear(notificationId, function() {});
  }, 10000);
};
