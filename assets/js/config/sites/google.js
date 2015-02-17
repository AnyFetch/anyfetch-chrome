"use strict";

module.exports = {
  name: 'Google Search',
  tests: {
    urls: [
      'https://www.google.fr/search?q=hello+world&oq=hello+world&aqs=chrome..69i57j0l5.1447j0j1&sourceid=chrome&es_sm=0&ie=UTF-8',
      'https://www.google.com/search?q=hello+world',
      'https://www.google.fr/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#safe=off&q=hi%20again'
    ],
    titles: {
      'Hello world - Recherche Google': ['Hello world'],
      'Hello world - Google Search': ['Hello world'],
      'Hello world - lol - Google Search': ['Hello world - lol'],
    }
  },
  // @see https://regex101.com/r/bG9qB7/2
  url: /google\.(?:\w+(?:\.\w+)?)\/(?:search|webhp|.*#q=)/,
  context: {
    title: /^(.+)\s-\s/i,
  },
  injection: {
    selector: '#rhs',
    type: 'append',
    path: '/popover.html',
    height: '500px',
    width: '100%;',
  }
};
