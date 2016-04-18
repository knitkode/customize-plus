/* global gulp, $, CONFIG, PLUGINS */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var StreamQueue = require('streamqueue');
var extend = require('deep-extend');
var pkg = require('../../package.json');


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
  gulp.watch('./src/bower.json', ['build-customize']);
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
    PATHS.src.bower + 'es5-shim/es5-shim.min.js'
  ]));
  return stream.done()
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
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
  return gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.if(rebuild, $.modernizr(modernizrOpts)))
    .pipe($.if(rebuild, $.rename('modernizr-custom.js')))
    .pipe($.if(rebuild, $.uglify({ preserveComments: function (node, comment) {
      // {@link http://dfkaye.github.io/2014/03/24/preserve-multiline-strings-with-uglify/}
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
 * @access private
 */
gulp.task('_customize-scripts-admin',
  [
    '_customize-scripts-admin_base',
    '_customize-scripts-admin_main'
  ]);

var adminScriptsLibraries = [
  PATHS.src.bower + 'polyfill-classList/classList.js', // @@ie9 @@ie8 \\
  PATHS.src.scripts + 'vendor-custom/modernizr-custom.js', // include modernizr custom build
  PATHS.src.bower + 'validator-js/validator.js',
  PATHS.src.bower + 'marked/lib/marked.js', // @@doubt or use http://git.io/vZ05a \\
  PATHS.src.scripts + 'vendor-custom/highlight.pack.js', // include highlight.js custom build
  PATHS.src.bower + 'jquery-ui-slider-pips/dist/jquery-ui-slider-pips.js', // @@todo, this is actually needed only in the layout_columns control... so maybe put it in the theme... \\
  PATHS.src.bower + 'selectize/dist/js/standalone/selectize.js',
  PATHS.src.bower + 'spectrum/spectrum.js'
];

/**
 * Scripts | Admin custom scripts (outside iframe)
 *
 * Disable minification here, is done through a bash script that runs the
 * uglify CLI which has more options, like `mangle-regex`
 *
 * @access private
 */
gulp.task('_customize-scripts-admin_base', function() {
  var stream = new StreamQueue({ objectMode: true });
  stream.queue(gulp.src(adminScriptsLibraries));
  stream.queue(gulp.src(PATHS.src.scripts + 'customize-base.js')
    .pipe($.include())
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = true;', 'var DEBUG = !!api.DEBUG;')))
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe($.if(CONFIG.isDist, $.trimlines(PLUGINS.trimlines)))
  );
  return stream.done()
    .pipe($.concat('customize-base.js', PLUGINS.concat))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = !!api.DEBUG;', '')))
    .pipe($.if(CONFIG.isDist, $.uglify(extend(PLUGINS.uglify, PLUGINS.uglifyCustomScripts))))
    .pipe(gulp.dest(PATHS.build.scripts));
});
gulp.task('_customize-scripts-admin_main', function() {
  return gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.include())
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = true;', 'var DEBUG = !!api.DEBUG;')))
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe($.if(CONFIG.isDist, $.trimlines(PLUGINS.trimlines)))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = !!api.DEBUG;', '')))
    .pipe($.if(CONFIG.isDist, $.uglify(extend(PLUGINS.uglify, PLUGINS.uglifyCustomScripts))))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Scripts | Preview (inside iframe)
 *
 * @access private
 */
gulp.task('_customize-scripts-preview', function() {
  return gulp.src(PATHS.src.scripts + 'customize-preview.js')
    .pipe($.concat('customize-preview.js', PLUGINS.concat))
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe(gulp.dest(PATHS.build.scripts))
    .pipe($.if(CONFIG.isDist, $.replace('var DEBUG = true;', ''))) // or var DEBUG = !!api.DEBUG;
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify)))
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(PATHS.build.scripts));
});

/**
 * Codestyle Trial
 *
 */
gulp.task('codestyle-trial', function() {
  return gulp.src('**/*.js', { cwd: PATHS.src.scripts })
    .pipe($.include())
    .pipe($.trimlines(PLUGINS.trimlines))
    .pipe($.jscs(PLUGINS.jscs))
    // .pipe($.replace('var DEBUG = true;', '')) // or var DEBUG = !!api.DEBUG;
    .pipe(gulp.dest(PATHS.src.scripts));
});
