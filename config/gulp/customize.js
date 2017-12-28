/* global CONFIG, PLUGINS */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var pkg = require('../../package.json');
const StreamQueue = require('streamqueue');
const extend = require('deep-extend');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const stripDebug = require('gulp-strip-debug');
const modernizr = require('gulp-modernizr');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const header = require('gulp-header');
const concat = require('gulp-concat');


/**
 * Build
 *
 * @access public
 */
gulp.task('build-customize', [
  '_customize-scripts'
]);

/**
 * Watch
 *
 * @access public
 */
gulp.task('watch-customize', function() {
  gulp.watch('./package.json', ['build-customize']);
  gulp.watch(PATHS.src.scripts + '**/*.js', ['_customize-scripts']);
});

/**
 * Scripts | Collect tasks
 *
 * @access private
 */
gulp.task('_customize-scripts', [
  '_customize-scripts-admin_libs',
  '_customize-scripts-admin',
  '_customize-scripts-preview'
]);

/**
 * Scripts | Admin libraries
 *
 * @access private
 */
gulp.task('_customize-scripts-admin_libs', function() {
  // Customize scripts admin libraries (outside iframe)
  var stream = new StreamQueue({ objectMode: true });
  stream.queue(gulp.src([
  ]));
  return stream.done()
    .pipe(gulpIf(CONFIG.isDist, stripDebug()))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Modernizr custom build
 *
 * @access private
 */
gulp.task('_customize-modernizr', function() {
  // modernizr does weird stuff, exclude it from build, just rebuild it on demand
  var rebuild = true;
  var modernizrOpts = extend(PLUGINS.modernizr, {
    'tests' : [ 'cssanimations', 'csstransforms', 'filereader', 'svg', 'webworkers' ]
  });
  // the src path is just needed by gulp but we don't want gulp-modernizr to
  // automatically look for tests to do, we just defined them here above
  return gulp.src(PATHS.src.scripts + 'customize/index.js')
    .pipe(gulpIf(rebuild, modernizr(modernizrOpts)))
    .pipe(gulpIf(rebuild, rename('modernizr-custom.js')))
    .pipe(gulpIf(rebuild, uglify({ preserveComments: function (node, comment) {
      // {@link http://dfkaye.github.io/2014/03/24/preserve-multiline-strings-with-uglify/}
      // just keep the comment with License
      // this regex should work but it doesn't: /[\s\S]*\/\*\![\s\S]*(license)/gi
      if (/license/gi.test(comment.value)) {
        return true;
      }
    }})))
    .pipe(gulpIf(rebuild, gulp.dest(PATHS.src.scripts + 'vendor-custom')));
});

/**
 * Scripts | Admin custom scripts (outside iframe)
 *
 * @access private
 */
const rollupOpts = {
  external: [
    'window',
    'document',
    'jquery',
    'underscore',
    'wp',
    'kkcp',
    'modernizr',
    'marked',
    'hljs',
  ],
  plugins: [
    require('rollup-plugin-node-resolve')({
      jsnext: true,
      main: true,
      browser: true,
    }),
    require('rollup-plugin-commonjs')({
      include: 'node_modules/**'
    }),
    require('rollup-plugin-buble')(),
    // eslint({
    //   exclude: [
    //     'src/styles/**',
    //   ]
    // })
  ]
}

const rollupOptsWrite = {
  format: 'iife',
  indent: '  ',
  intro: 'var DEBUG = true;',
  globals: {
    window: 'window',
    document: 'document',
    jquery: 'jQuery',
    underscore: '_',
    wp: 'wp',
    kkcp: 'kkcp',
    modernizr: 'Modernizr',
    marked: 'marked',
    hljs: 'hljs',
  },
  namedFunctionExpressions: false,
  interop: false,
};

gulp.task('_customize-scripts-admin-rollup', () => {
  return require('rollup').rollup(extend(rollupOpts, {
      entry: PATHS.src.scripts + 'customize/index.js'
    })).then((bundle) => {
      return bundle.write(extend(rollupOptsWrite, { dest: '.tmp/customize.js' }));
    });
});

gulp.task('_customize-scripts-admin', ['_customize-scripts-admin-rollup'], function() {
  var stream = new StreamQueue({ objectMode: true });
  stream.queue(gulp.src([
    PATHS.src.npm + 'classlist.js/classList.js', // @@ie9 @@ie8 \\
    PATHS.src.npm + 'knitkode-vendor/cp/modernizr-custom.js',
    PATHS.src.npm + 'knitkode-vendor/cp/highlight.pack.js',
    PATHS.src.npm + 'marked/lib/marked.js', // @@doubt or use http://git.io/vZ05a \\
    PATHS.src.npm + 'jQuery-ui-Slider-Pips/dist/jquery-ui-slider-pips.js', // @@todo, this is actually needed only in the layout_columns control... so maybe put it in the theme... \\
    PATHS.src.npm + 'selectize/dist/js/standalone/selectize.js',
    PATHS.src.npm + 'spectrum-colorpicker/spectrum.js',
  ]));
  stream.queue(gulp.src('.tmp/customize.js')
    .pipe(gulpIf(CONFIG.isDist, replace('var DEBUG = true;', 'var DEBUG = !!api.DEBUG;')))
    .pipe(gulpIf(CONFIG.isDist, header(CONFIG.credits, { pkg: pkg })))
  );
  return stream.done()
    .pipe(concat('customize.js', PLUGINS.concat))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf(CONFIG.isDist, replace('var DEBUG = !!api.DEBUG;', '')))
    .pipe(gulpIf(CONFIG.isDist, uglify(extend(PLUGINS.uglify, PLUGINS.uglifyCustomScripts))))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Preview (inside iframe)
 *
 * @access private
 */
gulp.task('_customize-scripts-preview', function() {
  return gulp.src(PATHS.src.scripts + 'customize-preview.js')
    // .pipe(sourcemaps.init())
    // .pipe(buble())
    // .pipe(sourcemaps.write('.'))
    .pipe(concat('customize-preview.js', PLUGINS.concat))
    .pipe(gulpIf(CONFIG.isDist, header(CONFIG.credits, { pkg: pkg })))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe(gulpIf(CONFIG.isDist, replace('var DEBUG = true;', ''))) // or var DEBUG = !!api.DEBUG;
    .pipe(gulpIf(CONFIG.isDist, uglify(PLUGINS.uglify)))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(PATHS.build.scripts));
});
