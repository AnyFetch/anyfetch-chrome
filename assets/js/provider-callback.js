'use strict';

function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

document.addEventListener('DOMContentLoaded', function() {
  var state = getParam('state') || 'success';
  var client = getParam('client') || 'The provider';

  var successIcon = document.getElementById('success-icon');
  var failIcon = document.getElementById('fail-icon');
  var message = document.getElementById('state-msg');

  if(state === 'success') {
    message.innerHTML = client + ' has been successfully linked!';
    successIcon.classList.remove('hidden');
  }
  else if(state === 'canceled') {
    message.innerHTML = client + ' authorization was canceled';
    failIcon.classList.remove('hidden');
  }
  else {
    message.innerHTML = 'An unknow state was returned by the provider';
  }
});
