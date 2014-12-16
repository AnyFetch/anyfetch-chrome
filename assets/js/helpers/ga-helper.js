'use strict';


/**
 */
module.exports.bindClickDocumentList = function() {
  var elements = document.querySelectorAll('.document-snippet > a');
  for(var i = 0; i < elements.length; i += 1) {
    elements[i].addEventListener("click", function() {
      var ga = window.ga;
      var attributes = this.attributes;
      for(var j = 0; j < attributes.length; j += 1) {
        var attr = attributes[j];
        if(attr.name.indexOf('data-ga-') === 0) {
          ga('send', 'event', 'click', attr.name.substring('data-ga-'.length), attr.value);
        }
      }
    }, false);
  }
};


/**
 */
module.exports.bindClickApp = function() {
  var element = document.getElementById('see-all');
  element.addEventListener("click", function() {
    var ga = window.ga;
    ga('send', 'event', 'click', 'more-results', '', this.getAttribute('data-ga-count'));
  }, false);
};
