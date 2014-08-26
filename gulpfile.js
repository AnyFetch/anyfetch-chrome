'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');

var paths = {
  js: {
    all: ['gulpfile.js', 'assets/js/**', 'test/**/*.js'],
    entryPoints: ['assets/js/main.js', 'assets/js/settings.js', 'assets/js/background.js']
  },
  less: {
    all: 'assets/less/**/*.less',
    entryPoints: ['assets/less/style.less', 'assets/less/settings.less', 'node_modules/chrome-bootstrap/chrome-bootstrap.less']
  },
  templates: {
    all: 'assets/templates/**'
  },
  target: 'dist/',
  // Files to be included in the final package
  package: ['dist/**', 'res/**', 'views/**', 'manifest.json']
};

// LESS compiling
gulp.task('less', function() {
  return gulp.src(paths.less.entryPoints)
    .pipe(less())
    .pipe(gulp.dest(paths.target));
});

// JS compiling
gulp.task('browserify', function() {
  return gulp.src(paths.js.entryPoints)
    .pipe(browserify({
      debug: true,
      insertGlobals: false,
      transform: ['brfs']
    }))
    .pipe(gulp.dest(paths.target));
});

// JS linting
gulp.task('lint', function() {
  return gulp.src(paths.js.all)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Packaging the app as a zip for publishing
gulp.task('package', function() {
  // TODO: bump version number (or read it from `package.json`)
  return gulp.src(paths.package, { base: '.' })
    .pipe(zip('anyfetch-chrome.zip'))
    .pipe(gulp.dest('./'));
});

// Auto-run tasks on file changes
gulp.task('watch', function() {
  gulp.watch(paths.js.all, ['lint', 'browserify']);
  gulp.watch(paths.templates.all, ['browserify']);
  gulp.watch(paths.less.all, ['less']);
});

// Run main tasks on launch
gulp.task('default', ['lint', 'less', 'browserify', 'watch'], function() {
});
