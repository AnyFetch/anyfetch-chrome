"use strict";

module.exports = {
  tests: {
    urls: [
      'https://app.futuresimple.com/leads/11866410',
    ],
  },
  url: /app\.futuresimple\.com\/leads/,
  context: {
    dom: [
      // Lead name
      {
        target: 'textContent',
        selector: '.detail-title'
      },
    ]
  }
};
