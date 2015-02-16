/* jshint node: true */

/**
 * Paths
 * @type {Object}
 */
module.exports = PATHS = {
  /** @type {String} */
  bower: './src/assets/bower_components/',
  /** @type {Object} */
  src: {
    root: './src/',
    vendor: './src/vendor/',
    includes: './src/includes/',
    views: './src/views/',
    assets: './src/assets/',
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