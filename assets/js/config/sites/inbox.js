"use strict";

module.exports = {
  name: 'Inbox by GMail',
  tests: {
    urls: [
      'https://inbox.google.com/u/0/',
    ]
  },
  url: /inbox\.google\.com\/(?:u\/[0-9]+\/)?.*$/,
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

      // Recipients
      [
        {
          target: 'textContent',
          selector: 'div.scroll-list-item-open[data-item-id*="#gmail:thread-f:"] span[email]'
        }
      ]
    ]
  }
};
