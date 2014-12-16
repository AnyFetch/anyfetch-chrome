"use strict";

module.exports = {
  name: 'Google Calendar',
  tests: {
    urls: [
      'https://www.google.com/calendar/render',
      'https://www.google.com/calendar/render#g',
      'https://www.google.com/calendar/render#f%7Ceid-MjAxNF9CSVJUSERBWV8xZWYxY2IxNjhkYmI4ZWIzICNjb250YWN0c0B2-0-0-',
    ]
  },
  url: /google\.com\/calendar\/render/,

  context: {
    dom: [
      // Event title
      [
        {
          target: 'textContent',
          selector: '.ui-sch.ep-title > div'
        },
        {
          target: 'value',
          selector: '.ui-sch.ep-title > input'
        },
      ],
      // Attendees
      {
        target: 'title',
        selector: '.ep-gl-guest'
      },
    ]
  }
};
