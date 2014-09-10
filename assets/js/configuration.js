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

  chrome.storage.sync.get(Object.keys(config.settings), function(userValues) {
    for(var key in config.settings) {
      var userValue = userValues[key];
      if(userValue || userValue === false) {
        config[key] = userValue;
      }
      else {
        config[key] = config.settings[key].default;
      }
    }
    cb();
  });
};

// TODO: more site support
// TODO: ability to match on URL fragment hash (page#hash)
// This seems to be a limitation of UrlFilter for now
var supportedSites = {
  github: {
    // https://github.com/Neamar
    url: 'github\\.com\/([^\/]+)\/?$',
    // Neamar (Matthieu Bacconnier)
    context: /.+\(([^\)]+)\)/i
  },
  linkedin: {
    // https://www.linkedin.com/profile/view?id=246055775
    url: 'linkedin\\.com\/profile\/',
    // Matthieu Bacconnier | LinkedIn
    context: /^([^|]+) |/i
  },
  viadeo: {
    // http://fr.viadeo.com/fr/profile/arnaud.malon
    url: 'viadeo\\.com\/.*\/*profile\/',
    // Arnaud Malon, CIC - France | Viadeo
    context: /^([^,]+), |/i
  },
  twitter: {
    // https://twitter.com/r_ricard
    url: 'twitter\\.com\/([^\/]+)$',
    // Robin Ricard (r_ricard) on Twitter
    context: /^(.+)\([^\)]+\)/i
  },
  facebook: {
    // https://www.facebook.com/ricardrobin
    url: 'facebook\\.com\/([^\/]+)$',
    // Robin Ricard
    context: /^(.+)$/i
  },
  googleContact: {
    // https://mail.google.com/mail/u/0/#contact/36ac30c08f01eff7
    url: 'mail\\.google\\.com\/mail\/',
    // Matthieu Bacconnier - Gestionnaire de contact - [email] - Gmail
    // TODO: dirty hack, we should make a stricter match on the URL
    context: /^(.+) - .*contact.*/i
  },
  googlePlus: {
    // https://plus.google.com/+MatthieuBacconnier/posts
    // https://plus.google.com/116561125336713006886/posts
    url: 'plus\\.google\\.com\/.*(?:\\+(.+)|(\\d{21,}))',
    // Matthieu Bacconnier - Google+
    // Matthieu Bacconnier (neamar) - Google+
    context: /^([^\(]+) [\(-]/i
  },
  salesForceContact: {
    // https://emea.salesforce.com/0032000001DoV22
    url: 'salesforce\\.com\/[a-zA-Z0-9]{15}$',
    // Contact: Matthieu Bacconnier ~ salesforce.com - Enterprise Edition
    context: /^Contact: (.+) \~ /i
  },
};

var configuration = {
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
