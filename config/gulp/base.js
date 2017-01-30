/* global gulp, $, CONFIG, PLUGINS */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var pkg = require('../../package.json');


/**
 * Build
 *
 * @access public
 */
gulp.task('build-base', ['_base-root', '_base-styles', '_base-php', '_base-vendor']);

/**
 * Watch
 *
 * @access public
 */
gulp.task('watch-base', function() {
  gulp.watch(PATHS.src.root + '*.*', ['_base-root']);
  gulp.watch(PATHS.src.images + '*.*', ['_base-images']);
  gulp.watch(PATHS.src.styles + '**/*.scss', ['_base-styles']);
  gulp.watch([PATHS.src.includes + '**/*.php', PATHS.src.views + '*.php'], ['_base-php']);
  gulp.watch(PATHS.src.vendor + '**/*.php', ['_base-vendor']);
});

/**
 * Root (files in the root folder)
 *
 * @access private
 */
gulp.task('_base-root', function() {
  return gulp.src([PATHS.src.root + '*.php', PATHS.src.root + 'composer.json'])
    .pipe(gulp.dest(PATHS.build.root));
});

/**
 * Images
 *
 * @access private
 */
gulp.task('_base-images', function() {
  return gulp.src([
      PATHS.src.images + '*.*',
      '!' + PATHS.src.images + '*.svg', // svg are inlined in css
      '!' + PATHS.src.images + '*.dev*' // exclude dev images (kind of sketches)
    ])
    .pipe($.cache($.imagemin(PLUGINS.imagemin)))
    .pipe($.if(function (file) {
      // for the props of `file` see http://stackoverflow.com/a/33245138/1938970
      return !file.relative.match(/^_/); // exclude `private` images
    }, gulp.dest(PATHS.build.images)));
});

/**
 * Styles
 *
 * Inline svg images in CSS file.
 *
 * @access private
 */
gulp.task('_base-styles', ['_base-images'], function() {
  var banner = CONFIG.isDist ? require('lodash.template')(CONFIG.credits)({ pkg: pkg }) : '';
  PLUGINS.base64.baseDir = PATHS.src.root;
  return gulp.src(PATHS.src.styles + '*.scss')
    .pipe($.if(CONFIG.isDist, $.replace(CONFIG.creditsPlaceholder, banner)))
    .pipe($.sass.sync(PLUGINS.sass).on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer')(PLUGINS.autoprefixer),
      require('css-mqpacker')(PLUGINS.cssMqpacker)
    ]))
    .pipe($.base64(PLUGINS.base64))
    .pipe($.if(CONFIG.isDist, $.replace(CONFIG.creditsPlaceholder, banner)))
    .pipe(gulp.dest(PATHS.build.styles))
    .pipe($.if(CONFIG.isDist, $.cssnano(PLUGINS.cssnano)))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(PATHS.build.styles));
});

/**
 * PHP | Classes
 *
 * Customize classes php group classes in one file
 *
 * @access private
 */
gulp.task('_base-php', function() {
  return gulp.src(PATHS.src.includes + '*.php')
    .pipe($.include())
    .pipe($.replace(/<\?php\s\/\/\s@partial/g, '')) // remove extra `<?php // @partial`
    .pipe(gulp.dest(PATHS.build.includes));
});

/**
 * PHP | Vendor
 *
 * Collect needed vendor files
 *
 * @access private
 */
gulp.task('_base-vendor', function() {
  return gulp.src([
      'oyejorge/less.php/**/*.php',
      '!oyejorge/less.php/test/**/*.*', // exclude test folder
      'tgm/**/class-tgm-plugin-activation.php',
    ], { cwd: PATHS.src.vendor, base: PATHS.src.vendor })
    .pipe(gulp.dest(PATHS.build.vendor));
});
