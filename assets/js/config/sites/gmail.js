"use strict";

module.exports = {
  name: 'Gmail',
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
        selector: 'div[role="main"] table[role="presentation"] > tr > td > div > div > div > div > h2',
        selected: false,
      },
      // Sender
      {
        target: 'name',
        selector: 'div[role="main"] table[role="presentation"] table > tbody > tr > td span[email]',
        filter: '[\\S+]( |@).+' // Remove first name only, and "me" text
      },
      // Contact in semi full view
      // Known bug: Contact in semi-full view won't be detected if not linked to a Google+ profile
      [
        {
          target: 'textContent',
          selector: 'div[role="main"] div[tabindex="0"]:not([aria-hidden="true"]) > a',
          filter: '[\\S+] .+' // Remove first name only, or pseudonym
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
  },
  injection: {
    selector: 'div[role="main"] div[role="complementary"]',
    type: 'prepend',
    path: '/gmail.html',
    width: '220px',
    height: '400px'
  }
};
