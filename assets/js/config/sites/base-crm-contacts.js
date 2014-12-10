"use strict";

module.exports = {
  tests: {
    urls: [
      'https://app.futuresimple.com/crm/contacts/70149392',
    ],
    titles: {
      'Base CRM: Alexis Montagne': ['Alexis Montagne'],
    }
  },
  url: /app\.futuresimple\.com\/crm\/contacts/,
  context: {
    title: /Base\sCRM:\s(.+)/i,
  },
};