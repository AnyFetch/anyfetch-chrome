"use strict";

module.exports = {
  tests: {
    urls: [
      'https://emea.salesforce.com/0032000001DoV22',
    ],
    titles: {
      'Contact: Matthieu Bacconnier ~ salesforce.com - Enterprise Edition': ['Matthieu Bacconnier'],
      'Contact : Matthieu Bacconnier ~ salesforce.com - Developer Edition': ['Matthieu Bacconnier'],
    }
  },
  url: /salesforce\.com\/[a-zA-Z0-9]{15}$/,
  context: {
    title: /^Contact(?:\s)?(.+)\s\~\s/i
  },
};
