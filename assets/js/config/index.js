'use strict';

/**
 * Asynchronously load the user settings
 * and update `this` (the config object) adequately.
 * Default values are taken from `this.settings`.
 * Each setting is stored as a first-level property.
 * @param {Function} cb()
 */
var loadUserSettings = function(cb) {
  var config = this;
  var toLoad = Object.keys(config.settings);
  toLoad = toLoad.concat(['blacklist']);

  chrome.storage.sync.get(toLoad, function(userValues) {
    toLoad.forEach(function(key) {
      var userValue = userValues[key];
      if(userValue || userValue === false) {
        config[key] = userValue;
      }
      else if(config.settings[key]) {
        config[key] = config.settings[key].default;
      }
    });
    cb();
  });
};

// TODO: more site support
// This seems to be a limitation of UrlFilter for now
var supportedSites = {
  github: {
    // https://github.com/Neamar
    url: /github\.com\/([^\/]+)\/?$/,
    // Neamar (Matthieu Bacconnier)
    context: {
      title: /.+\(([^\)]+)\)/i
    }
  },
  linkedin: {
    // https://www.linkedin.com/profile/view?id=246055775
    url: /linkedin\.com\/profile\//,
    // Matthieu Bacconnier | LinkedIn
    context: {
      title: /^([^|]+) |/i
    }
  },
  viadeo: {
    // http://fr.viadeo.com/fr/profile/arnaud.malon
    url: /viadeo\.com\/.*\/*profile\//,
    // Arnaud Malon, CIC - France | Viadeo
    context: {
      title: /^([^,]+), |/i
    }
  },
  twitter: {
    // https://twitter.com/r_ricard
    url: /twitter\.com\/([^\/]+)$/,
    // Robin Ricard (r_ricard) on Twitter
    context: {
      title: /^(.+)\([^\)]+\)/i
    }
  },
  facebook: {
    // https://www.facebook.com/ricardrobin
    url: /facebook\.com\/([^\/]+)$/,
    // Robin Ricard
    context: {
      title: /^(.+)$/i
    }
  },
  googleContactOnGmail: {
    // https://mail.google.com/mail/u/0/#contact/36ac30c08f01eff7
    url: /mail\.google\.com\/mail\/u\/[0-9]+\/.*#contact\/[0-9a-f]+/,
    // Matthieu Bacconnier - Gestionnaire de contact - [email] - Gmail
    context: {
      title: /^(.+) - .*contact.*/i
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

var configuration = {
  blacklist: {},

  /**
   * Setting name => default value
   */
  settings: {
    token: {
      placeholder: '64 hexadecimal characters',
      default: '',
      label: 'Token'
    },
    apiUrl: {
      placeholder: 'https://api.anyfetch.com',
      default: 'https://api.anyfetch.com',
      label: 'AnyFetch API URL'
    },
    managerUrl: {
      placeholder: 'https://manager.anyfetch.com',
      default: 'https://manager.anyfetch.com',
      label: 'Anyfetch manager URL'
    },
    serverUrl: {
      placeholder: 'https://anyfetch-chrome.herokuapp.com',
      default: 'https://anyfetch-chrome.herokuapp.com',
      label: 'AnyFetch Chrome Server URL'
    },
    appUrl: {
      placeholder: 'https://app.anyfetch.com',
      default: 'https://app.anyfetch.com',
      label: 'AnyFetch app URL'
    }
  },

  /**
   * Due to the asynchronous nature of the `chrome.storage` API,
   * this function must be called before reading the properties
   * of this config object.
   */
  loadUserSettings: loadUserSettings,

  /**
   * site name => {
   *   url: regexp to determine if we're on a supported page
   *   context: regexp to extract the context query from the page's title
   * }
   *
   * @note For some reason, Chrome UrlFilter regexp must be strings.
   * @note Other way (more complex): match from the HTML. But it seems more complicated:
   * @see http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
   * @see https://developer.chrome.com/extensions/content_scripts
   */
  supportedSites: supportedSites,

  /** Number of results to load for a query */
  resultsCountLimit: 10,

  /**
   * Minimum delay between two calls to `POST /company/update`
   * for a single company (in milliseconds).
   */
  companyUpdateDelay: 30 * 60 * 1000
};

module.exports = configuration;
