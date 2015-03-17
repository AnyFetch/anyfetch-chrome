"use strict";

module.exports = {
  name: 'Base CRM (Lead)',
  tests: {
    urls: [
      'https://app.futuresimple.com/leads/11866410',
    ],
  },
  url: /app\.futuresimple\.com\/leads/,
  context: [
    // Lead name
    {
      dom: {
        target: 'textContent',
        selector: '.detail-title'
      },
      quote: true,
    }
  ]
};
