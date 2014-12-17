"use strict";

module.exports = {
  name: 'Github',
  tests: {
    urls: [
      'https://github.com/Neamar',
      'https://github.com/saveman71'
    ],
    nonMatchingUrls: [
      'https://github.com/Neamar/examplerepo',
      'https://github.com/notifications',
      'https://github.com/blog',
      'https://github.com/explore',
      'https://github.com/showcases',
      'https://github.com/trending',
      'https://github.com/stars',
      'https://github.com/new',
    ],
    titles: {
      'Neamar (Matthieu Bacconnier)': ['Neamar', 'Matthieu Bacconnier'],
      'hard(test) (Harder ( Test)': ['hard(test)', 'Harder ( Test']
    }
  },
  url: /github\.com\/(?!notifications|blog|explore|showcases|trending|stars|new)[^\/]+\/?$/,
  context: {
    title: /^(.+?)\s\((.+)\)$/i
  }
};
