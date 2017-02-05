/* jshint node: true */
'use strict';

var gulp = require('gulp');

/**
 * Paths
 * @type {Object}
 */
global.PATHS = {
  /** @type {Object} */
  src: {
    root: './src/',
    npm: './node_modules/',
    vendor: './src/vendor/',
    includes: './src/includes/',
    views: './src/views/',
    images: './src/images/',
    scripts: './src/scripts/',
    styles: './src/styles/',
  },
  /** @type {Object} */
  build: {
    root: './build/',
    vendor: './build/vendor/',
    includes: './build/includes/',
    assets: './build/assets/',
    images: './build/assets/images/',
    styles: './build/assets/css',
    scripts: './build/assets/js',
  }
};

// @access public
gulp.task('build', ['build-base', 'build-customize']);

// @access public
gulp.task('watch', [
  'watch-base',
  'watch-customize'
]);

// @access public
gulp.task('modernizr', ['_customize-modernizr']);


// Require the gulp folder with all the tasks, don't change this
require('./config/common/gulp');

// Add all the gruntfile tasks to gulp, don't change this
require('gulp-grunt')(require('gulp'));
