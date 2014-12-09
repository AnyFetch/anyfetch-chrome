"use strict";

module.exports = {
  tests: {
    urls: [
      'https://app.futuresimple.com/sales/deals/3351303',
    ],
  },
  url: /app\.futuresimple\.com\/sales\/deals/,
  context: {
    dom: [
      // Deal title
      {
        target: 'textContent',
        selector: '.detail-title'
      },
      {
        target: 'textContent',
        selector: '.info-section.deal-essentials .associated a'
      },
    ]
  }
};
