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
    for(var key in userValues) {
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
   * @note Other way (more complex): match from the HTML. But it seems more complicated:
   * @see http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
   * @see https://developer.chrome.com/extensions/content_scripts
   */
  supportedSites: {
    github: {
      // https://github.com/Neamar
      url: /github\.com\/([^\/]+)/i,
      // Neamar (Matthieu Bacconnier)
      context: /.+\(([^\)]+)\)/i
    },
    linkedin: {
      // https://www.linkedin.com/profile/view?id=246055775
      url: /linkedin\.com\/profile\//i,
      // Matthieu Bacconnier | LinkedIn
      context: /([^|]+) |/i
    }
  },

  /** Number of results to load for a query */
  resultsCountLimit: 10
};

module.exports = configuration;
