/* jshint node: true */

/**
 * Paths
 * @type {Object}
 */
module.exports = PATHS = {
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
module.exports = PATHS = require('util')._extend(PATHS, {
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


var gulp = require('gulp');


// @public
gulp.task('default', ['build', 'watch']);

// @public
gulp.task('build', [
  'build-base',
  'build-customize'
]);

// @public
gulp.task('watch', [
  'watch-base',
  'watch-customize'
]);

// @public
gulp.task('help', require('gulp-task-listing'));

// @public
gulp.task('modernizr', ['_customize-modernizr']);

// Require the gulp folder with all the tasks, don't change this
require('./config/gulp');