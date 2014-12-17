"use strict";

module.exports = {
  name: 'LinkedIn',
  tests: {
    urls: [
      'https://www.linkedin.com/profile/view?id=246055775',
      'https://www.linkedin.com/pub/matthieu-bacconnier/6a/4a1/47b'
    ],
    titles: {
      'Matthieu Bacconnier | LinkedIn': ['Matthieu Bacconnier'],
    }
  },
  url: /linkedin\.com\/(?:pub|profile)\//,
  context: {
    title: /^(.+)\s\|\sLinkedIn$/i
  }
};
