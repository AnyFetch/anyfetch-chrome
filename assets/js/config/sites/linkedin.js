"use strict";

module.exports = {
  tests: {
    urls: [
      'https://www.linkedin.com/profile/view?id=246055775'
    ],
    titles: {
      'Matthieu Bacconnier | LinkedIn': ['Matthieu Bacconnier'],
    }
  },
  url: /linkedin\.com\/profile\//,
  context: {
    title: /^(.+)\s\|\sLinkedIn$/i
  }
};
