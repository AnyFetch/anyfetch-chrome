"use strict";

// TODO: more site support
// This seems to be a limitation of UrlFilter for now
module.exports = {
  github: {
    tests: {
      urls: [
        'https://github.com/Neamar'
      ],
      titles: {
        'Neamar (Matthieu Bacconnier)': ['Neamar', 'Matthieu Bacconnier'],
        'hard(test) (Harder ( Test)': ['hard(test)', 'Harder ( Test']
      }
    },
    url: /github\.com\/([^\/]+)\/?$/,
    context: {
      title: /^(.+?)\s\((.+)\)$/i
    }
  },
  linkedin: {
    tests: {
      urls: [
        'https://www.linkedin.com/profile/view?id=246055775'
      ],
      titles: {
        'Matthieu Bacconnier | LinkedIn': ['Matthieu Bacconnier'],
      }
    },
    url: /linkedin\.com\/profile\//,
    context: {
      title: /^(.+)\s\|\sLinkedIn$/i
    }
  },
  viadeo: {
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
  },
  twitter: {
    tests: {
      urls: [
        'https://twitter.com/r_ricard'
      ],
      titles: {
        'Robin Ricard (@r_ricard) | Twitter': ['Robin Ricard', 'r_ricard'],
      }
    },
    url: /twitter\.com\/([^\/]+)$/,
    context: {
      title: /^(.+)\s\(@(.+)\)\s\| Twitter$/i
    }
  },
  facebook: {
    tests: {
      urls: [
        'https://www.facebook.com/saveman71'
      ],
      titles: {
        'Antoine Bolvy': ['Antoine Bolvy'],
        '(42) Antoine Bolvy': ['Antoine Bolvy'],
      }
    },
    url: /facebook\.com\/([^\/]+)$/,
    context: {
      title: /^(?:\(\d+\)\s)?(.+)$/i
    }
  },
  googleContactOnGmail: {
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
  },
  googleContact: {
    tests: {
      urls: [
        'https://www.google.com/contacts/?hl=en&tab=CC#contact/group/706c53ee8bdab485/Vie+pro/5c2151189ef6394',
        'https://www.google.com/contacts/#contact/5c2151189ef6394',
      ],
      titles: {
        'Antoine Bolvy - Google Contacts': ['Antoine Bolvy'],
      }
    },
    url: /google\.com\/contacts\/(?:u\/[0-9]+\/)?.*#contact\/(?:.*)[0-9a-f]+/,
    context: {
      title: /^(.+)\s-\s.*contact.*/i
    }
  },
  gmail: {
    tests: {
      urls: [
        'https://mail.google.com/mail/u/0/#inbox',
        'https://mail.google.com/mail/u/0/#drafts',
        'https://mail.google.com/mail/u/42/#inbox/14a2c5913c9c71f4',
      ]
    },
    url: /mail\.google\.com\/mail\/u\/[0-9]+\/.*#.+/,
    context: {
      dom: [
        // Email in full view
        // Subject
        {
          target: 'textContent',
          selector: 'div[role="main"] table > tr > td > div > div > div > div > h2'
        },
        // Sender
        {
          target: 'name',
          selector: 'div[role="main"] table > tbody > tr > td > h3 > span[email]'
        },
        // Contact in semi full view
        [
          {
            target: 'textContent',
            selector: 'div[role="main"] div[tabindex="0"]:not([aria-hidden="true"]) > a'
          }
        ],
        // Related Google+ Page
        [
          {
            target: 'textContent',
            selector: 'div[role="main"] div[role="complementary"] table > tbody > tr > td > span[tabindex="0"]'
          }
        ]
      ]
    }
  },
  googlePlus: {
    tests: {
      urls: [
        'https://plus.google.com/+MatthieuBacconnier/posts',
        'https://plus.google.com/116561125336713006886/posts',
        'https://plus.google.com/u/0/communities/113734333929587843685'
      ],
      titles: {
        'Matthieu Bacconnier - Google+': ['Matthieu Bacconnier'],
        'Matthieu Bacconnier (neamar) - Google+': ['Matthieu Bacconnier', 'neamar'],
      }
    },
    url: /plus\.google\.com\/.*(?:\+(.+)|(?:\d{21,}))/,
    context: {
      title: /^(.+?)\s?(\(.*\))?\s-\sGoogle\+$/i
    }
  },
 salesForceContact: {
    // https://emea.salesforce.com/0032000001DoV22
    url: /salesforce\.com\/[a-zA-Z0-9]{15}$/,
    // Contact: Matthieu Bacconnier ~ salesforce.com - Enterprise Edition
    context: {
      title: /^Contact:\s(.+) \~ /i
    },
  },
  googleCalendar: {
    // https://www.google.com/calendar/render
    // https://www.google.com/calendar/render#
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
  },
  google: {
    url: /google\.[a-z]{2,63}\/search/,
    context: {
      title: /^(.+)\s-\s/i,
    },
  },
  baseCrmContacts: {
    url: /app\.futuresimple\.com\/crm\/contacts/,
    context: {
      title: /Base\sCRM:\s(.+)/i,
    },
  },
  baseCrmLeads: {
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
  },
  baseCrmDeals: {
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
  }
};
