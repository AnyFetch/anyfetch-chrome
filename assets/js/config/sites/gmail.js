"use strict";

module.exports = {
  tests: {
    urls: [
      'https://mail.google.com/mail/u/0/#inbox',
      'https://mail.google.com/mail/u/0/#drafts',
      'https://mail.google.com/mail/u/42/#inbox/14a2c5913c9c71f4',
    ]
  },
  // @see https://regex101.com/r/aT5nJ2/2
  url: /mail\.google\.com\/mail\/(?:u\/[0-9]+\/)?.*#(?!contact|label).*$/,
  context: {
    dom: [
      // Email in full view
      // Subject
      {
        target: 'textContent',
        selector: 'div[role="main"] table > tr > td > div > div > div > div > h2'
      },
      // Sender
      {
        target: 'name',
        selector: 'div[role="main"] table > tbody > tr > td span[email]'
      },
      // Contact in semi full view
      // Known bug: Contact in semi-full view won't be detected if not linked to a Google+ profile
      [
        {
          target: 'textContent',
          selector: 'div[role="main"] div[tabindex="0"]:not([aria-hidden="true"]) > a'
        }
      ],
      // Related Google+ Page
      [
        {
          target: 'textContent',
          selector: 'div[role="main"] div[role="complementary"] table > tbody > tr > td > span[tabindex="0"]'
        }
      ]
    ]
  }
};
