const paths = require('../dev-lib/paths');
const config = require('../dev-lib/config');
const plugins = require('../dev-lib/gulp/plugins');
const pkg = require(paths.join(paths.ROOT, 'package.json'));
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const base64 = require('gulp-base64');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const include = require('gulp-include');

/**
 * Base tasks (build and watch)
 */
module.exports = {
  build: function baseBuild (callback) {
    return gulp.parallel(
      baseRoot,
      gulp.series(
        baseImages,
        baseStyles,
      ),
      basePhp,
      baseVendor,
    )(callback);
  },
  watch: function baseWatch () {
    gulp.watch(paths.join(paths.SRC, '*.*'), baseRoot);
    gulp.watch(paths.join(paths.src.images, '*.*'), baseImages);
    gulp.watch(paths.join(paths.src.styles, '**/*.scss'), baseStyles);
    gulp.watch([
      paths.join(paths.src.includes, '**/*.php'),
      paths.join(paths.src.views, '*.php')
    ], basePhp);
    gulp.watch(paths.join(paths.src.vendor, '**/*.php'), baseVendor);
  }
}

/**
 * Root (files in the root folder)
 */
function baseRoot () {
  return gulp.src([
      paths.join(paths.SRC, '*.php'),
      paths.join(paths.SRC, 'composer.json'),
    ])
    .pipe(gulp.dest(paths.DIST));
}

/**
 * Images
 */
function baseImages () {
  return gulp.src([
      paths.join(paths.src.images, '*.*'),
      '!' + paths.join(paths.src.images, '*.svg'), // svg are inlined in css
      '!' + paths.join(paths.src.images, '*.dev*'), // exclude dev images (kind of sketches)
    ])
    .pipe(cache(imagemin(plugins.imagemin)))
    .pipe(gulpIf(function (file) {
      // for the props of `file` see http://stackoverflow.com/a/33245138/1938970
      return !file.relative.match(/^_/); // exclude `private` images
    }, gulp.dest(paths.dist.images)));
}

/**
 * Styles
 *
 * Inline svg images in CSS file.
 */
function baseStyles () {
  const banner = config.isDist ? require('lodash.template')(config.credits)({ pkg: pkg }) : '';
  plugins.base64.baseDir = paths.SRC;

  return gulp.src(paths.join(paths.src.styles, '*.scss'))
    .pipe(gulpIf(config.isDist, replace(config.creditsPlaceholder, banner)))
    .pipe(sass.sync(plugins.sass).on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer')(plugins.autoprefixer),
      require('css-mqpacker')(plugins.cssMqpacker)
    ]))
    .pipe(base64(plugins.base64))
    .pipe(gulpIf(config.isDist, replace(config.creditsPlaceholder, banner)))
    .pipe(gulp.dest(paths.dist.styles))
    .pipe(gulpIf(config.isDist, cssnano(plugins.cssnano)))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.styles));
}

/**
 * Base PHP task
 *
 * In the ditributable version (`--dist`) exclude `includes/`` subfolders.
 * Group php classes in subfolders of `includes` into single files transforming
 * php `require` in gulp-include `require` to inline php files. After that
 * remove extra `<?php // @partial` that was needed during development.
 */
function basePhp () {
  const path = config.isDist ? paths.join(paths.src.includes, '*.php') : paths.join(paths.src.includes, '**/*.php');
  return gulp.src(path)
    .pipe(gulpIf(config.isDist, replace("require ( KKCP_PLUGIN_DIR . 'includes/", '//=require ')))
    .pipe(include())
    .pipe(gulpIf(config.isDist, replace(/<\?php\s\/\/\s@partial/g, '')))
    .pipe(gulp.dest(paths.dist.includes));
}

/**
 * Vendor PHP task
 *
 * Collect needed vendor files
 */
function baseVendor () {
  return gulp.src([
      'oyejorge/less.php/**/*.php',
      '!oyejorge/less.php/test/**/*.*', // exclude test folder
      'tgm/**/class-tgm-plugin-activation.php',
    ], { cwd: paths.src.vendor, base: paths.src.vendor })
    .pipe(gulp.dest(paths.dist.vendor));
}
