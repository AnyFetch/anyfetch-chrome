"use strict";

module.exports = {
  name: 'Base CRM (Deal)',
  tests: {
    urls: [
      'https://app.futuresimple.com/sales/deals/3351303',
    ],
  },
  url: /app\.futuresimple\.com\/sales\/deals/,
  context: [
    {
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
  ]
};
