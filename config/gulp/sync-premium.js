/* global gulp, PLUGINS */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var extend = require('util')._extend;
var jeditor = require('gulp-json-editor');


/**
 * Build
 *
 * @access public
 */
gulp.task('sync-with-premium', [
   // if fs.exists('premium-folder')
  '_sync-with-premium-bower',
  '_sync-with-premium-composer',
  '_sync-with-premium-files',
]);

/**
 * Watch
 *
 * @access public
 */
gulp.task('watch-sync-with-premium', function() {
  // gulp.watch('./src/bower.json', ['build-customize']);
  // gulp.watch(PATHS.src.scripts + '**/*.js', ['_customize-scripts']);
});

/**
 * Files
 *
 * @access private
 */
gulp.task('_sync-with-premium-files', function() {
  return gulp.src(PATHS.toPremium.files, { base: PATHS.src.root })
    .pipe(gulp.dest(PATHS.toPremium.src.root));
});

/**
 * Bower
 *
 * @access private
 */
gulp.task('_sync-with-premium-bower', function() {
  var freeBower = require('../../' + PATHS.src.root + 'bower.json');
  var premiumBower = require('../../' + PATHS.toPremium.src.root + 'bower.json');
  gulp.src(PATHS.src.root + 'bower.json', { base: PATHS.src.root })
    .pipe(jeditor({
      'dependencies': extend(freeBower.dependencies, premiumBower.dependencies),
      'devDependencies': extend(freeBower.devDependencies, premiumBower.devDependencies)
    }, PLUGINS.jsonEditor))
    .pipe(gulp.dest(PATHS.toPremium.src.root));
});

/**
 * Composer
 *
 * @access private
 */
gulp.task('_sync-with-premium-composer', function() {
  var freeBower = require('../../' + PATHS.src.root + 'composer.json');
  var premiumBower = require('../../' + PATHS.toPremium.src.root + 'composer.json');
  gulp.src(PATHS.src.root + 'composer.json', { base: PATHS.src.root })
    .pipe(jeditor({
      'require': extend(freeBower.require, premiumBower.require),
    }, PLUGINS.jsonEditor))
    .pipe(gulp.dest(PATHS.toPremium.src.root));
});
