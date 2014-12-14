'use strict';


/**
 */
module.exports.bindClick = function(selector, category) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i += 1) {
    elements[i].addEventListener("click", function() {
      var ga = window.ga || function() {};
      ga('send', 'event', category, 'click', this.getAttribute('data-ga-label'));
    }, false);
  }
};
