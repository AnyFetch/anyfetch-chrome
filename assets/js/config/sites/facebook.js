"use strict";

module.exports = {
  tests: {
    urls: [
      'https://www.facebook.com/saveman71'
    ],
    titles: {
      'Antoine Bolvy': ['Antoine Bolvy'],
      '(42) Antoine Bolvy': ['Antoine Bolvy'],
    }
  },
  url: /facebook\.com\/([^\/]+)$/,
  context: {
    title: /^(?:\(\d+\)\s)?(.+)$/i
  }
};
