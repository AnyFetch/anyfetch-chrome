'use strict';
require('./mixpanel');
var config = require('./config');

var goTo = function goTo(position) {
  var next = document.getElementById('next');
  var prev = document.getElementById('prev');
  var end = document.getElementById('end');


  var steps = document.querySelector('#steps');
  var current = document.querySelector('#steps > .active');
  var toActivate = document.querySelector('#steps > [data-position="' + position + '"]');
  if(toActivate) {
    current.classList.remove('active');
    toActivate.classList.add('active');
  }

  if(steps.lastChild === toActivate) {
    next.classList.add('hidden');
    end.classList.remove('hidden');
  }
  else {
    end.classList.add('hidden');
    next.classList.remove('hidden');
  }

  if(steps.firstChild === toActivate) {
    prev.classList.add('hidden');
  }
  else {
    prev.classList.remove('hidden');
  }

  window.mixpanel.identify(config.store.userId);
  window.mixpanel.track("How to use", {
    email: config.store.email,
    step: position
  });
};

var goToRelative = function goToRelative(relativePos) {
  var current = document.querySelector('#steps > .active');
  var currentPos = current.getAttribute('data-position');
  currentPos = parseInt(currentPos) || 0;
  goTo(currentPos + relativePos);
};

document.addEventListener('DOMContentLoaded', function() {
  var marketplaceUrl = "https://manager.anyfetch.com/marketplace";

  document.getElementById('open-marketplace').addEventListener('click', function() {
    chrome.windows.create({
      url: marketplaceUrl,
      type: 'popup',
      width: 1100,
      height: 800
    }, null);
  });

  config.store.loadSettings(function() {
    window.mixpanel.identify(config.store.userId);
    window.mixpanel.track_links("a.btn", "Open marketplace", {
      email: config.store.email,
      origin: "how to use"
    });
    window.mixpanel.track("How to use", {
      email: config.store.email,
      step: 1
    });

    if(config.store.email) {
      marketplaceUrl = "https://manager.anyfetch.com/sign_in?redirection=%2Fmarketplace&email=" + config.store.email;
    }

    var next = document.getElementById('next');
    var prev = document.getElementById('prev');
    var end = document.getElementById('end');

    if(prev) {
      prev.addEventListener('click', function() {
        goToRelative(-1);
      });
    }
    if(next) {
      next.addEventListener('click', function() {
        goToRelative(1);
      });
    }
    if(end) {
      end.addEventListener('click', function() {
        window.close();
      });
    }
  });
});
