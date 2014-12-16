"use strict";

module.exports = {
  name: 'Gmail (Contact)',
  tests: {
    urls: [
      'https://mail.google.com/mail/u/0/#contact/36ac30c08f01eff7',
      'https://mail.google.com/mail/u/42/#contact/36ac30c08f01eff7',
      'https://mail.google.com/mail/#contact/36ac30c08f01eff7',
    ],
    titles: {
      'Matthieu Bacconnier - Gestionnaire de contact - foo@gmail.com - Gmail': ['Matthieu Bacconnier'],
      'I have a - in my name - Contact Manager - foo@gmail.com - Gmail': ['I have a - in my name'],
    }
  },
  url: /mail\.google\.com\/mail\/(?:u\/[0-9]+\/)?.*#contact\/[0-9a-f]+/,
  context: {
    title: /^(.+)\s-\s(?:.*contact.*)\s-\s(?:.+)\s-\sGmail$/i
  }
};
