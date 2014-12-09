"use strict";

// TODO: more site support
// This seems to be a limitation of UrlFilter for now
module.exports = {
  github: {
    // https://github.com/Neamar
    url: /github\.com\/([^\/]+)\/?$/,
    // Neamar (Matthieu Bacconnier)
    context: {
      title: /^(.*) \((.*)\)$/i
    }
  },
  linkedin: {
    // https://www.linkedin.com/profile/view?id=246055775
    url: /linkedin\.com\/profile\//,
    // Matthieu Bacconnier | LinkedIn
    context: {
      title: /^(.*) \| LinkedIn$|/i
    }
  },
  viadeo: {
    // http://fr.viadeo.com/fr/profile/arnaud.malon
    url: /viadeo\.com\/.*\/*profile\//,
    // Arnaud Malon, CIC - France | Viadeo
    context: {
      title: /^(.*?), (.*?) - (?:.*) \| Viadeo$/i
    }
  },
  twitter: {
    // https://twitter.com/r_ricard
    url: /twitter\.com\/([^\/]+)$/,
    // Robin Ricard (@r_ricard) | Twitter
    context: {
      title: /^(.*) \(@(.*)\) \| Twitter$/i
    }
  },
  facebook: {
    // https://www.facebook.com/ricardrobin
    url: /facebook\.com\/([^\/]+)$/,
    // Robin Ricard
    // (5) Robin Ricard
    context: {
      title: /^(?:\(\d+\) )?(.*)$/i
    }
  },
  googleContactOnGmail: {
    // https://mail.google.com/mail/u/0/#contact/36ac30c08f01eff7
    url: /mail\.google\.com\/mail\/u\/[0-9]+\/.*#contact\/[0-9a-f]+/,
    // Matthieu Bacconnier - Gestionnaire de contact - [email] - Gmail
    context: {
      title: /^(.*?) - (?:.*contact.*) - (?:.*) - Gmail$/i
    }
  },
  googleContact: {
    // https://mail.google.com/mail/u/0/#contact/36ac30c08f01eff7
    url: /google\.com\/contacts\/u\/[0-9]+\/.*#contact\/[0-9a-f]+/,
    // Matthieu Bacconnier - Google Contacts
    context: {
      title: /^(.+) - .*contact.*/i
    }
  },
  gmail: {
    // https://mail.google.com/mail/u/0/#inbox
    // https://mail.google.com/mail/u/1/#drafts
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
    // https://plus.google.com/+MatthieuBacconnier/posts
    // https://plus.google.com/116561125336713006886/posts
    url: /plus\.google\.com\/.*(?:\\+(.+)|(\\d{21,}))/,
    // Matthieu Bacconnier - Google+
    // Matthieu Bacconnier (neamar) - Google+
    context: {
      title: /^([^\(]+) [\(-]/i
    }
  },
 salesForceContact: {
    // https://emea.salesforce.com/0032000001DoV22
    url: /salesforce\.com\/[a-zA-Z0-9]{15}$/,
    // Contact: Matthieu Bacconnier ~ salesforce.com - Enterprise Edition
    context: {
      title: /^Contact: (.+) \~ /i
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
      title: /^(.+) - /i,
    },
  },
  baseCrmContacts: {
    url: /app\.futuresimple\.com\/crm\/contacts/,
    context: {
      title: /Base CRM: (.+)/i,
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
