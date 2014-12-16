"use strict";

module.exports = {
  name: 'Facebook',
  tests: {
    urls: [
      'https://www.facebook.com/saveman71',
      'https://www.facebook.com/groups/552447494882281/'
    ],
    titles: {
      'Antoine Bolvy': ['Antoine Bolvy'],
      '(42) Antoine Bolvy': ['Antoine Bolvy'],
    }
  },
  // @see https://regex101.com/r/iL5iS0/1
  url: /facebook\.com\/(?:(?:groups|events)\/[0-9]{15}\/|(?!notifications|settings)[^\/]+$)/,
  context: {
    title: /^(?:\(\d+\)\s)?(.+)$/i
  }
};
