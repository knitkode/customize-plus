/* jshint node: true */
'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');

/**
 * Paths
 * @type {Object}
 */
var PATHS = {
  /** @type {Object} */
  src: {
    root: './src/',
    vendor: './src/vendor/',
    includes: './src/includes/',
    views: './src/views/',
    assets: './src/assets/',
    bower: './src/assets/bower_components/',
    images: './src/assets/images/',
    scripts: './src/assets/scripts/',
    styles: './src/assets/styles/',
  },
  /** @type {Object} */
  build: {
    root: './build/',
    vendor: './build/vendor/',
    includes: './build/includes/',
    assets: './build/assets/',
    images: './build/assets/images/',
    styles: './build/assets/',
    scripts: './build/assets/',
  }
};

/**
 * Paths to Premium Plugin version
 * @type {Object}
 */
PATHS = require('util')._extend(PATHS, {
  /** @type {Object} */
  toPremium: {
    files: [
      // includes
      PATHS.src.includes + '**/*.php',
      // '!' + PATHS.src.includes + '**/.*.php',
      // views
      PATHS.src.views + '*.php',
      // images
      PATHS.src.images + '*.*',
      // scripts
      PATHS.src.scripts + '**/*.js',
      '!' + PATHS.src.scripts + 'customize.js',
      // styles
      PATHS.src.styles + '**/*.scss',
      '!' + PATHS.src.styles + 'admin.scss',
      '!' + PATHS.src.styles + 'customize.scss'
    ],
    // destination
    src: {
      root: '../customize-plus-premium-synced/src/'
    }
  }
});

global.PATHS = PATHS;


// @public
gulp.task('build', sequence([
    'build-base',
    'build-customize'
  ],
  '_build-replace-words'
));

// @public
gulp.task('watch', [
  'watch-base',
  'watch-customize'
]);

// @public
gulp.task('modernizr', ['_customize-modernizr']);


// Require the gulp folder with all the tasks, don't change this
require('./config/gulp');


 // @@temp \\
var jsdoc = require("gulp-jsdoc");
gulp.task('docs-js', function () {
  gulp.src('./build/assets/customize.js')
    .pipe(jsdoc('./docs-js'));
});