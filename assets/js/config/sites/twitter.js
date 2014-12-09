"use strict";

module.exports = {
  tests: {
    urls: [
      'https://twitter.com/r_ricard'
    ],
    titles: {
      'Robin Ricard (@r_ricard) | Twitter': ['Robin Ricard', 'r_ricard'],
    }
  },
  url: /twitter\.com\/([^\/]+)$/,
  context: {
    title: /^(.+)\s\(@(.+)\)\s\| Twitter$/i
  }
};
