"use strict";

module.exports = {
  name: 'Facebook',
  tests: {
    urls: [
      'https://www.facebook.com/saveman71',
      'https://www.facebook.com/groups/552447494882281/',
      'https://www.facebook.com/events/824796907543405/?sid_reminder=7532448463301115904',
      'https://www.facebook.com/groups/lelaunchpad/638766156250414/?notif_t=group_activity'
    ],
    nonMatchingUrls: [
      'https://www.facebook.com/notifications',
      'https://www.facebook.com/settings',
      'https://www.facebook.com/events/upcoming',
      'https://www.facebook.com/messages/saveman71'
    ],
    titles: {
      'Antoine Bolvy': ['Antoine Bolvy'],
      '(42) Antoine Bolvy': ['Antoine Bolvy'],
    }
  },
  url: /facebook\.com\/(?:(?:groups|events)\/(?:[0-9]{15}|\w+)\/|(?!notifications|settings)[^\/]+$)/,
  context: {
    title: /^(?:\(\d+\)\s)?(.+)$/i
  }
};
