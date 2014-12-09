"use strict";

module.exports = {
  tests: {
    urls: [
      'https://www.google.com/contacts/?hl=en&tab=CC#contact/group/706c53ee8bdab485/Vie+pro/5c2151189ef6394',
      'https://www.google.com/contacts/#contact/5c2151189ef6394',
    ],
    titles: {
      'Antoine Bolvy - Google Contacts': ['Antoine Bolvy'],
    }
  },
  url: /google\.com\/contacts\/(?:u\/[0-9]+\/)?.*#contact\/(?:.*)[0-9a-f]+/,
  context: {
    title: /^(.+)\s-\s.*contact.*/i
  }
};
