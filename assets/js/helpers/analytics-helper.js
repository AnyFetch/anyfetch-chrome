'use strict';


/**
 * Attach a listener for clicks on the snippets, for analytics purpose
 */
module.exports.bindClickDocumentList = function() {
  var elements = document.querySelectorAll('.document-snippet > a');
  for(var i = 0; i < elements.length; i += 1) {
    elements[i].addEventListener("click", function() {
      var mixpanel = window.mixpanel;
      var attributes = this.attributes;

      var props = {};
      for(var j = 0; j < attributes.length; j += 1) {
        var attr = attributes[j];
        if(attr.name.indexOf('data-analytics-') === 0) {
          props[attr.name.substring('data-analytics-'.length)] = attr.value;
        }
      }

      mixpanel.track(
        "Document Click",
        props
      );

      mixpanel.people.increment({
        documentClickCount: 1
      });

      mixpanel.people.set({
        "lastDocumentClick": new Date()
      });

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
    var mixpanel = window.mixpanel;
    mixpanel.track(
      "Leaving to app",
      {
        count: this.getAttribute('data-analytics-count')
      }
    );
  }, false);
};
