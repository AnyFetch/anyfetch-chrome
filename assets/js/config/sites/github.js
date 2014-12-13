"use strict";

module.exports = {
  name: 'Github',
  tests: {
    urls: [
      'https://github.com/Neamar'
    ],
    titles: {
      'Neamar (Matthieu Bacconnier)': ['Neamar', 'Matthieu Bacconnier'],
      'hard(test) (Harder ( Test)': ['hard(test)', 'Harder ( Test']
    }
  },
  url: /github\.com\/([^\/]+)\/?$/,
  context: {
    title: /^(.+?)\s\((.+)\)$/i
  }
};
