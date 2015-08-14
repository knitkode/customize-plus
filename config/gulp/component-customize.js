/* global gulp, $ */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var CONFIG = require('./common-config');
var PLUGINS = require('./common-plugins');
var streamqueue = require('streamqueue');
var extend = require('util')._extend;
var pkg = require('../../package.json');


/**
 * Build
 *
 * @public
 */
gulp.task('build-customize', [
  '_customize-scripts'
]);

/**
 * Watch
 *
 * @public
 */
gulp.task('watch-customize', function() {
  gulp.watch('./src/bower.json', ['build-customize']);
  gulp.watch(PATHS.src.scripts + '**/*.js', ['_customize-scripts']);

});

/**
 * Scripts | Collect tasks
 *
 * @private
 */
gulp.task('_customize-scripts', [
  '_customize-scripts-admin-libs',
  '_customize-scripts-admin',
  '_customize-scripts-preview'
]);

/**
 * Scripts | Admin libraries
 *
 * @private
 */
gulp.task('_customize-scripts-admin-libs', function() {
  // Customize scripts admin libraries (outside iframe)
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src([
    PATHS.src.bower + 'es5-shim/es5-shim.min.js'
  ]));
  return stream.done()
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Modernizr custom build
 *
 * @private
 */
gulp.task('_customize-modernizr', function() {
  // modernizr does weird stuff, exclude it from build, just rebuild it on demand
  var rebuild = true;
  var modernizrOpts = extend(PLUGINS.modernizr, {
    'tests' : [ 'cssanimations', 'csstransforms', 'filereader', 'webworkers' ]
  });
  // the src path is just needed by gulp but we don't want gulp-modernizr to
  // automatically look for tests to do, we just defined them here above
  return gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.if(rebuild, $.modernizr(modernizrOpts)))
    .pipe($.if(rebuild, $.rename('modernizr-custom.js')))
    .pipe($.if(rebuild, $.uglify({ preserveComments: function (node, comment) {
      // @link http://dfkaye.github.io/2014/03/24/preserve-multiline-strings-with-uglify/
      // just keep the comment with License
      // this regex should work but it doesn't: /[\s\S]*\/\*\![\s\S]*(license)/gi
      if (/license/gi.test(comment.value)) {
        return true;
      }
    }})))
    .pipe($.if(rebuild, gulp.dest(PATHS.src.scripts + 'vendor-custom')));
});

/**
 * Scripts | Admin custom scripts (outside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-admin', ['_customize-scripts-admin-unminified', '_customize-scripts-admin-minified']);

var adminScriptsLibraries = [
  PATHS.src.bower + 'polyfill-classList/classList.js', // @@ie9 @@ie8 \\
  PATHS.src.scripts + 'vendor-custom/modernizr-custom.js', // include modernizr custom build
  PATHS.src.bower + 'validator-js/validator.js',
  PATHS.src.bower + 'sweetalert/dist/sweetalert-dev.js',
  PATHS.src.bower + 'marked/lib/marked.js', // @@doubt, not sure if always include this, or maybe use https://github.com/SimonWaldherr/micromarkdown.js\\
  PATHS.src.scripts + 'vendor-custom/highlight.pack.js', // include highlight.js custom build
  PATHS.src.bower + 'mousetrap/mousetrap.js',
  PATHS.src.bower + 'mousetrap/plugins/bind-dictionary/mousetrap-bind-dictionary.js',
  PATHS.src.bower + 'mousetrap/plugins/global-bind/mousetrap-global-bind.js',
  PATHS.src.bower + 'mousetrap/plugins/pause/mousetrap-pause.js',
  PATHS.src.bower + 'jquery-ui-slider-pips/dist/jquery-ui-slider-pips.js', // @@todo, this is actually needed only in the layout_columns control... so maybe put it in the theme...
  PATHS.src.bower + 'jquery-cookie/jquery.cookie.js',
  PATHS.src.bower + 'webui-popover/dist/jquery.webui-popover.js',
  PATHS.src.bower + 'selectize/dist/js/standalone/selectize.js',
  PATHS.src.bower + 'spectrum/spectrum.js'
];

/**
 * Scripts | Admin custom scripts unminified (outside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-admin-unminified', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src(adminScriptsLibraries));
  stream.queue(gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe(/*$.if(CONFIG.isDist, */$.header(CONFIG.credits, { pkg: pkg }))/*)*/
    .pipe($.include())
    // .pipe($.if(argv.docs, $.jsdoc('./docs')))
  );
  return stream.done()
    .pipe($.concat('customize.js', PLUGINS.concat))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Admin custom scripts minified (outside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-admin-minified', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src(adminScriptsLibraries)
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify))));
  stream.queue(gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.include())
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = true;', '')))
    .pipe($.if(CONFIG.isDist, $.uglify(extend(PLUGINS.uglify, PLUGINS.uglifyCustomScripts))))
    .pipe(/*$.if(CONFIG.isDist,*/ $.header(CONFIG.credits, { pkg: pkg }))/*)*/
  );
  return stream.done()
    .pipe($.concat('customize.min.js', PLUGINS.concat))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Preview (inside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-preview', function() {
  return gulp.src(PATHS.src.scripts + 'customize-preview.js')
    .pipe($.concat('customize-preview.js', PLUGINS.concat))
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = true;', '')))
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify)))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(PATHS.build.scripts));
});
