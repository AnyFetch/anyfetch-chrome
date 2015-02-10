"use strict";

module.exports = {
  name: 'LinkedIn',
  tests: {
    urls: [
      'https://www.linkedin.com/profile/view?id=246055775',
      'https://www.linkedin.com/pub/matthieu-bacconnier/6a/4a1/47b',
      'https://www.linkedin.com/in/antoinebolvy/en',
      'https://www.linkedin.com/in/antoinebolvy'
    ],
  },
  url: /linkedin\.com\/(?:pub|profile|in)\//,
  context: {
    // We have to use DOM, since linkedin shows "Your profile" on your own profile
    dom: [
      {
        target: 'textContent',
        selector: '#name-container span.full-name'
      }
    ]
  },
  injection: {
    target: '#aux',
    type: 'prepend',
    path: '/popover.html'
  }
};
