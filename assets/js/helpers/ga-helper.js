'use strict';


/**
 * Attach a listener for clicks on the snippets, for analytics purpose
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
 * Attach a listener for clicks on the see all link, for analytics purpose
 */
module.exports.bindClickApp = function() {
  var element = document.getElementById('see-all');
  if(!element) {
    return;
  }

  element.addEventListener("click", function() {
    var ga = window.ga;
    ga('send', 'event', 'click', 'more-results', '', this.getAttribute('data-ga-count'));
  }, false);
};
