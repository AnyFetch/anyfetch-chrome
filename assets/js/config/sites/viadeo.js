"use strict";

module.exports = {
  tests: {
    urls: [
      'http://fr.viadeo.com/fr/profile/arnaud.malon'
    ],
    titles: {
      'Arnaud Malon, CIC - France | Viadeo': ['Arnaud Malon', 'CIC'],
      'Big Boss, Groupe ßosh (Foo, Bar, ...) - Allemagne | Viadeo': ['Big Boss', 'Groupe ßosh (Foo, Bar, ...)']
    }
  },
  url: /viadeo\.com\/.*\/*profile\//,
  context: {
    title: /^(.+?), (.+?) - (?:.+) \| Viadeo$/i
  }
};
