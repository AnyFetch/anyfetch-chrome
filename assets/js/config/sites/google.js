"use strict";

module.exports = {
  tests: {
    urls: [
      'https://www.google.fr/search?q=hello+world&oq=hello+world&aqs=chrome..69i57j0l5.1447j0j1&sourceid=chrome&es_sm=0&ie=UTF-8',
      'https://www.google.com/search?q=hello+world',
    ],
    titles: {
      'Hello world - Recherche Google': ['Hello world'],
      'Hello world - Google Search': ['Hello world'],
      'Hello world - lol - Google Search': ['Hello world - lol'],
    }
  },
  // @see https://regex101.com/r/bG9qB7/1
  url: /google\.(?:\w+(?:\.\w+)?)\/(?:search|.*#q=)/,
  context: {
    title: /^(.+)\s-\s/i,
  },
};
