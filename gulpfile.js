'use strict';

var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');

var paths = {
  js: {
    all: ['gulpfile.js', 'assets/js/**', 'test/**/*.js'],
    entryPoints: [
      'assets/js/background.js',
      'assets/js/popup.js',
      'assets/js/first-run.js',
      'assets/js/advanced-settings.js',
      'assets/js/settings.js',
      'assets/js/oauth-callback.js',
      'assets/js/content-script/advanced-detection.js',
      'assets/js/ga.js',
    ]
  },
  libs: {
    entryPoints: [
      'bower_components/anyfetch-assets/dist/index-moment.min.js',
    ]
  },
  less: {
    all: 'assets/less/**/*.less',
    entryPoints: [
      'assets/less/style.less',
      'assets/less/popover.less',
      'assets/less/settings.less',
    ]
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

// Libs
gulp.task('libs', function() {
  var p = gulp.src(paths.libs.entryPoints);
  return p.pipe(gulp.dest(paths.target));
});


// JS compiling
// gulp-browserify seems to be a deprecated plugin. http://goo.gl/bz8n4L
gulp.task('browserify', function() {
  paths.js.entryPoints.forEach(function(file) {
    var bundler = browserify({
      entries: './' + file
    });

    bundler.transform('brfs');

    return bundler
      .bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(rename(function(path) {
        path.dirname = '';
      }))
      .pipe(gulp.dest(paths.target));
  });
});

// JS linting
gulp.task('lint', function() {
  return gulp.src(paths.js.all)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Packaging the app as a zip for publishing
gulp.task('package', ['lint', 'less', 'browserify', 'libs'], function() {
  // Read version number from `package.json`
  var npmPackageInfo = require('./package.json');
  // Update Chrome extension version
  var manifest = require('./manifest.json');
  manifest.version = npmPackageInfo.version;
  // Write result back to `manifest.json`
  var output = JSON.stringify(manifest, null, 2) + "\n";
  fs.writeFileSync('./manifest.json', output);

  return gulp.src(paths.package, {
    base: '.'
  })
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
gulp.task('default', ['lint', 'less', 'browserify', 'libs', 'watch'], function() {
});
