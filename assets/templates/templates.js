'use strict';

var fs = require('fs');

/**
 * @file Thanks to the BRFS Browserify transform,
 * the static resources loaded via `fs.readFileSync`
 * end up being inlined directly into the compiled JS source.
 */

module.exports = {
  results: fs.readFileSync(__dirname + '/results.html', 'utf8'),
  listItem: fs.readFileSync(__dirname + '/list-item.html', 'utf8'),
  snippet: fs.readFileSync(__dirname + '/snippet.html', 'utf8')
};
