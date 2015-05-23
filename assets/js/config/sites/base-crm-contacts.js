"use strict";

module.exports = {
  name: 'Base CRM (Contact)',
  tests: {
    urls: [
      'https://app.futuresimple.com/crm/contacts/70149392',
    ],
    titles: {
      'Base CRM: Alexis Montagne': ['Alexis Montagne'],
    }
  },
  url: /app\.futuresimple\.com\/crm\/contacts/,
  context: [
    {
      title: /Base\sCRM:\s(.+)/i,
      quote: true,
      type: 'main-contact',
    },
  ]
};
