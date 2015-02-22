'use strict';

var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less');
var jade = require('gulp-jade');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var zip = require('gulp-zip');

var paths = {
  js: {
    all: ['gulpfile.js', 'assets/js/**/*.js', 'test/**/*.js'],
    entryPoints: [
      'assets/js/background.js',
      'assets/js/popover.js',
      'assets/js/first-run.js',
      'assets/js/how-to-use.js',
      'assets/js/advanced-settings.js',
      'assets/js/settings.js',
      'assets/js/content-script/content-script.js',
      'assets/js/mixpanel.js',
    ],
    target: 'extension/js'
  },
  libs: [
    {
      files: ['bower_components/anyfetch-assets/dist/index-moment.min.js'],
      target: 'extension/js'
    },
    {
      files: ['./images/**/*'],
      target: 'extension/images'
    },
    {
      files: ['bower_components/anyfetch-assets/images/document-types/**/*'],
      target: 'extension/images/document-types/'
    }
  ],
  less: {
    all: 'assets/less/**/*.less',
    entryPoints: [
      'assets/less/style.less',
      'assets/less/popover.less',
      'assets/less/settings.less',
      'assets/less/injection/*.less',
    ],
    target: 'extension/css'
  },
  jade: {
    all: 'assets/jade/**/*.jade',
    entryPoints: [
      'assets/jade/popover.jade',
      'assets/jade/background.jade',
      'assets/jade/settings.jade',
      'assets/jade/advanced-settings.jade',
      'assets/jade/first-run.jade',
      'assets/jade/how-to-use.jade',
      'assets/jade/oauth-callback.jade',
      'assets/jade/injection/*.jade',
    ],
    target: 'extension/'
  },
  templates: {
    all: 'assets/templates/**/*'
  },
  target: 'extension/',
  package: 'extension/**/*'
};

var swallowError = function swallowError(error) {
  // If you want details of the error in the console
  console.log(error.toString());
  this.emit('end');
};

// LESS compiling
gulp.task('less', function() {
  return gulp.src(paths.less.entryPoints)
    .pipe(less())
    .on('error', swallowError)
    .pipe(gulp.dest(paths.less.target));
});

// Libs (copy)
gulp.task('libs', function() {
  paths.libs.forEach(function(path) {
    var p = gulp.src(path.files);
    return p.pipe(gulp.dest(path.target));
  });
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
      .on('error', swallowError)
      .pipe(source(file))
      .pipe(buffer())
      .pipe(rename(function(path) {
        path.dirname = '';
      }))
      .pipe(gulp.dest(paths.js.target));
  });
});

// JS linting
gulp.task('lint', function() {
  return gulp.src(paths.js.all)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Jade view compiling
gulp.task('jade', function() {
  var locals = {};

  gulp.src(paths.jade.entryPoints)
    .pipe(jade({
      locals: locals
    }))
    .on('error', swallowError)
    .pipe(gulp.dest(paths.jade.target));
});

// Manifest generation
gulp.task('manifest', function() {
  var manifestFilename = './assets/manifest.json';
  var manifestFile = JSON.parse(fs.readFileSync(manifestFilename, 'utf8'));
  // Read version number from `package.json`
  var packageFile = require('./package.json');
  // Update manifest version
  manifestFile.version = packageFile.version;
  // Write it back to the file
  fs.writeFileSync(manifestFilename, JSON.stringify(manifestFile, null, 2) + '\n');
  gulp.src(manifestFilename).pipe(gulp.dest(paths.target));
});

// Packaging the app as a zip for publishing
gulp.task('package', ['lint', 'less', 'browserify', 'libs', 'jade', 'manifest'], function() {
  return gulp.src(paths.package)
    .pipe(zip('anyfetch-chrome.zip'))
    .pipe(gulp.dest('./'));
});

// Auto-run tasks on file changes
gulp.task('watch', function() {
  gulp.watch(paths.js.all, ['lint', 'browserify']);
  gulp.watch(paths.templates.all, ['browserify']);
  gulp.watch(paths.less.all, ['less']);
  gulp.watch(paths.jade.all, ['jade']);
  gulp.watch('assets/manifest.json', ['manifest']);
});

// Run main tasks on launch
gulp.task('default', ['lint', 'less', 'browserify', 'libs', 'jade', 'manifest', 'watch'], function() {
});
