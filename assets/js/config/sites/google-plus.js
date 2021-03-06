"use strict";

module.exports = {
  name: 'Google Plus',
  tests: {
    urls: [
      'https://plus.google.com/+MatthieuBacconnier/posts',
      'https://plus.google.com/116561125336713006886/posts',
      'https://plus.google.com/u/0/communities/113734333929587843685'
    ],
    titles: {
      'Matthieu Bacconnier - Google+': ['Matthieu Bacconnier', undefined],
      'Matthieu Bacconnier (neamar) - Google+': ['Matthieu Bacconnier', 'neamar'],
    }
  },
  url: /plus\.google\.com\/.*(?:\+(.+)|(?:\d{21,}))/,
  context: [
    {
      title: /^(.+?)\s?(?:\((.*)\))?(?:\s-\s.*)?\s-\sGoogle\+$/i,
      quote: true,
      type: 'main-contact',
    }
  ]
};
