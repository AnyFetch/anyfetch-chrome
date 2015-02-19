'use strict';

var supportedSites = require('./sites.js');
var Store = require('./store.js');

var Config = function Config() {
  /**
   * Defaults values for settings, these are mandatory and used to know
   * which settings are saved to chrome's storage.
   */
  this.defaults = {
    userId: '',
    email: '',
    companyId: '',
    providerCount: 0,
    blacklist: [],
    token: '',
    apiUrl: 'https://api.anyfetch.com',
    managerUrl: 'https://manager.anyfetch.com',
    serverUrl: 'https://anyfetch-chrome.herokuapp.com',
    appUrl: 'https://app.anyfetch.com',
  };

  /**
   * Settings to be displayed on the advanced settings page
   */
  this.settings = {
    token: {
      placeholder: '64 hexadecimal characters',
      label: 'Token'
    },
    apiUrl: {
      placeholder: 'An URL of an instance of the AnyFetch API',
      label: 'AnyFetch API URL'
    },
    managerUrl: {
      placeholder: 'An URL to the AnyFetch Manager',
      label: 'Anyfetch manager URL'
    },
    serverUrl: {
      placeholder: 'An URL to the AnyFetch Chrome authentification server',
      label: 'AnyFetch Chrome Server URL'
    },
    appUrl: {
      placeholder: 'An URL to the AnyFetch App',
      label: 'AnyFetch app URL'
    }
  };

  /**
   * Interface with chrome.storage
   */
  this.store = new Store(Object.keys(this.defaults), this.defaults);

  /**
   * Static list of supported sites. Includes their method of detection (regexes)
   */
  this.supportedSites = supportedSites;

  /**
   * Number of results to load for a query
   */
  this.resultsCountLimit = 10;
};

module.exports = new Config();
