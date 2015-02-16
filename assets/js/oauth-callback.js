'use strict';

function getParam(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

document.addEventListener('DOMContentLoaded', function() {
  var token = getParam('token');

  chrome.runtime.sendMessage({
    type: 'anyfetch::backgroundSetToken',
    token: token
  }, function(response) {
    if(!response) {
      console.err(chrome.runtime.lastError);
      return;
    }
    chrome.runtime.sendMessage({
      type: 'anyfetch::frontLoginSuccessful'
    });
  });
});
