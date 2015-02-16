/* global gulp, $, PATHS */
/* jshint node: true */
'use strict';

var plugins = require('./wpkuus-plugins');
var config = require('./wpkuus-config');
var utilErrors = require('wpkuus-util-errors');
var pngquant = require('imagemin-pngquant');
var pkg = require('../../package.json');

/**
 * Build
 *
 * @public
 */
gulp.task('build-base', ['_base-root', '_base-styles', '_base-php', '_base-vendor']);

/**
 * Watch
 *
 * @public
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
 * @private
 */
gulp.task('_base-root', function() {
  return gulp.src([PATHS.src.root + '*.php', PATHS.src.root + 'composer.json'])
    .pipe(gulp.dest(PATHS.build.root));
});

/**
 * Images
 *
 * @private
 */
gulp.task('_base-images', function() {
  return gulp.src([PATHS.src.images + '*.*', '!' + PATHS.src.images + '*.dev*'])
    .pipe($.if(CONFIG.isDist, $.cached(
      $.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      })
    )))
    .pipe(gulp.dest(PATHS.build.images));
});

/**
 * Styles
 *
 * Inline svg images in CSS file.
 *
 * @private
 */
gulp.task('_base-styles', ['_base-images'], function() {
  return gulp.src(PATHS.src.styles + '*.scss')
    .pipe($.sass())
    .on('error', utilErrors)
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.if(CONFIG.isDist, $.base64({
      baseDir: PATHS.src.assets,
      extensions: ['svg'],
      debug: true
    })))
    .pipe($.autoprefixer(plugins.autoprefixer))
    .pipe($.if(CONFIG.isDist, $.combineMediaQueries()))
    .pipe($.if(CONFIG.isDist, $.minifyCss()))
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe(gulp.dest(PATHS.build.assets));
});

/**
 * PHP | Classes
 *
 * Customize classes php group classes in one file
 *
 * @private
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
 * @private
 */
gulp.task('_base-vendor', function() {
  return gulp.src([
      'oyejorge/less.php/**/*.php',
      '!oyejorge/less.php/test/**/*.*', // exclude test folder
      'tgm/**/class-tgm-plugin-activation.php',
    ], { cwd: PATHS.src.vendor, base: PATHS.src.vendor })
    .pipe(gulp.dest(PATHS.build.vendor));
});
