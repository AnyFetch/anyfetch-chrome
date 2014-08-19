'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');

var paths = {
  js: {
    all: ['gulpfile.js', 'assets/js/**', 'test/**/*.js'],
    entryPoint: 'assets/js/main.js'
  },
  less: {
    all: 'assets/less/**/*.less',
    entryPoint: 'assets/less/style.less',
  },
  target: 'dist/',
  ignores: ['/lib/**']
};

// LESS compiling
gulp.task('less', function() {
  return gulp.src(paths.less.entryPoint)
    .pipe(less())
    .pipe(gulp.dest(paths.target));
});

// JS compiling
gulp.task('browserify', function() {
  return gulp.src(paths.js.entryPoint)
    .pipe(browserify({
      debug: true,
      insertGlobals: false
    }))
    .pipe(gulp.dest(paths.target));
});

// JS linting
gulp.task('lint', function() {
  return gulp.src(paths.js.all)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Auto-run tasks on file changes
gulp.task('watch', function() {
  gulp.watch(paths.js.all, ['lint', 'browserify']);
  gulp.watch(paths.less.all, ['less']);
});

// Run main tasks on launch
gulp.task('default', ['lint', 'less', 'browserify', 'watch'], function() {
});
