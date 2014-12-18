"use strict";

module.exports = {
  name: 'Inbox by GMail',
  tests: {
    urls: [
      'https://inbox.google.com/u/0/',
    ]
  },
  // @see https://regex101.com/r/aT5nJ2/2
  url: /inbox\.google\.com\/(?:u\/[0-9]+\/)?.*#(?!contact|label).*$/,
  context: {
    dom: [
      // Email in full view
      // Subject
      {
        target: 'textContent',
        selector: 'div.scroll-list-item-open[data-item-id*="#gmail:thread-f:"] div[data-action-data*="#gmail:thread-f:"]'
      },

      // Sender
      {
        target: 'name',
        selector: 'div.scroll-list-item-open[data-item-id*="#gmail:thread-f:"] div[email]'
      },
      // Contact in semi full view
      // Known bug: Contact in semi-full view won't be detected if not linked to a Google+ profile
      [
        {
          target: 'textContent',
          selector: 'div.scroll-list-item-open[data-item-id*="#gmail:thread-f:"] span[email]'
        }
      ]
    ]
  }
};
