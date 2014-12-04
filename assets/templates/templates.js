'use strict';

var fs = require('fs');

/**
 * @file Thanks to the BRFS Browserify transform,
 * the static resources loaded via `fs.readFileSync`
 * end up being inlined directly into the compiled JS source.
 */

module.exports = {
  context: fs.readFileSync(__dirname + '/context.html', 'utf8'),
  results: fs.readFileSync(__dirname + '/results.html', 'utf8'),
  spinner: fs.readFileSync(__dirname + '/spinner.html', 'utf8'),
  login: fs.readFileSync(__dirname + '/please-login.html', 'utf8'),
  listItem: fs.readFileSync(__dirname + '/list-item.html', 'utf8'),
  snippet: fs.readFileSync(__dirname + '/snippet.html', 'utf8'),
  settingsInput: fs.readFileSync(__dirname + '/settings-input.html', 'utf8'),
};
