'use strict';

var configuration = {
  // TODO: read from the extension's settings
  anyFetchUrl: 'https://api-staging.anyfetch.com',
  // TODO: read from the extension's settings
  anyFetchAppUrl: 'https://app-staging.anyfetch.com',
  // TODO: read from the extension's settings
  anyFetchToken: 'some_token',

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
  }
};

module.exports = configuration;
