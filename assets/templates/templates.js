'use strict';

var fs = require('fs');

/**
 * @file Thanks to the BRFS Browserify transform,
 * the static resources loaded via `fs.readFileSync`
 * end up being inlined directly into the compiled JS source.
 * TODO: As this grows, requiring unused templates would make the generated js heavy.
 *       -> think of something to prevent this.
 */

module.exports = {
  context: fs.readFileSync(__dirname + '/display/context.html', 'utf8'),
  results: fs.readFileSync(__dirname + '/display/results.html', 'utf8'),
  spinner: fs.readFileSync(__dirname + '/display/spinner.html', 'utf8'),
  login: fs.readFileSync(__dirname + '/display/please-login.html', 'utf8'),
  snippet: fs.readFileSync(__dirname + '/display/snippet.html', 'utf8'),
  header: fs.readFileSync(__dirname + '/display/header.html', 'utf8'),
  settingsInput: fs.readFileSync(__dirname + '/display/settings-input.html', 'utf8'),

  doctype_5252ce4ce4cfcd16f55cfa3a: fs.readFileSync(__dirname + '/document-types/contact.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa3c: fs.readFileSync(__dirname + '/document-types/document.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa4a: fs.readFileSync(__dirname + '/document-types/document.html', 'utf8'), // note uses the same template as document
  doctype_5252ce4ce4cfcd16f55cfa3f: fs.readFileSync(__dirname + '/document-types/email.html', 'utf8'),
  doctype_656d61696c2d746872656164: fs.readFileSync(__dirname + '/document-types/email-thread.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa40: fs.readFileSync(__dirname + '/document-types/event.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa3b: fs.readFileSync(__dirname + '/document-types/file.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa3d: fs.readFileSync(__dirname + '/document-types/image.html', 'utf8'),
  doctype_5252ce4ce4cfcd16f55cfa3e: fs.readFileSync(__dirname + '/document-types/trello-card.html', 'utf8'),
};
