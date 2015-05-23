"use strict";

module.exports = {
  name: 'Twitter',
  tests: {
    urls: [
      'https://twitter.com/r_ricard'
    ],
    titles: {
      'Robin Ricard (@r_ricard) | Twitter': ['Robin Ricard', 'r_ricard'],
    }
  },
  url: /twitter\.com\/([^\/]+)$/,
  context: [
    {
      title: /^(.+)\s\(@(.+)\)\s\| Twitter$/i,
      quote: true,
      type: 'main-contact',
    }
  ]
};
