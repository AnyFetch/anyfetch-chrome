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
