'use strict';

var configuration = {
  /**
   * site name => URL pattern regexp
   */
  supportedSites: {
    // https://github.com/merlinND
    github: /github\.com\/([^\/]+)/i,
    // https://www.linkedin.com/profile/view?id=255575282
    linkedin: /linkedin\.com\/profile\//i
  },

  /**
   * site name => tab title regexp capturing the context query string
   *
   * Other way (more complex): match from the HTML
   * <span class="vcard-fullname" itemprop="name">Merlin Nimier-David</span>
   * But it's way more complicated:
   * @see http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
   * @see https://developer.chrome.com/extensions/content_scripts
   */
  contextPattern: {
    github: /.+\(([^\)]+)\)/i,
    linkedin: /([^|]+) |/i
  }
};

module.exports = configuration;
