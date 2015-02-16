/* global gulp, $, PATHS */
/* jshint node: true */

var CONFIG = require('./wpkuus-config');
var PLUGINS = require('./wpkuus-plugins');
var streamqueue = require('streamqueue');
var extend = require('util')._extend;
// var swigHelpers = require('./wpkuus-util-swig-helpers');
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
  gulp.watch('./bower.json', ['build']);
  gulp.watch(PATHS.src.assets + 'scripts/**/*.js', ['_customize-scripts']);

});

/**
 * Scripts | Collect tasks
 *
 * @private
 */
gulp.task('_customize-scripts', [
  '_customize-scripts-admin-libs',
  '_customize-scripts-admin',
  '_customize-scripts-admin-worker',
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
  stream.queue(gulp.src(PATHS.bower + 'es5-shim/es5-shim.min.js'));
  stream.queue(gulp.src(PATHS.bower + 'less/dist/less.min.js'));
  stream.queue(gulp.src(PATHS.bower + 'less-worker/dist/less.min.js')
    .pipe($.rename('less-worker.min.js'))
  );
  return stream.done()
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
    .pipe(gulp.dest(PATHS.build.assets));
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
  return gulp.src(PATHS.src.assets + 'scripts/customize.js')
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
    .pipe($.if(rebuild, gulp.dest(PATHS.src.assets + 'scripts/vendor')));
});

/**
 * Scripts | Admin custom scripts (outside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-admin', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src([
    PATHS.bower + 'polyfill-classList/classList.js', // k6ie9 k6ie8 \\
    PATHS.src.assets + 'scripts/vendor/modernizr-custom.js', // include modernizr custom build
    PATHS.bower + 'lunr.js/lunr.min.js',
    PATHS.bower + 'jquery-ui-slider-pips/dist/jquery-ui-slider-pips.min.js',
    PATHS.bower + 'jquery-cookie/jquery.cookie.js',
    PATHS.bower + 'webui-popover/dist/jquery.webui-popover.min.js',
    PATHS.bower + 'selectize/dist/js/standalone/selectize.js',
    PATHS.bower + 'Caret.js/dist/jquery.caret.js',
    PATHS.bower + 'At.js/dist/js/jquery.atwho.js'
  ]));
  stream.queue(gulp.src(PATHS.src.assets + 'scripts/customize.js')
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe($.include())
    // .pipe($.if(argv.docs, $.jsdoc('./docs')))
  );
  return stream.done()
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify)))
    .pipe($.concat('customize.min.js', { newLine: '\n' }))
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
    .pipe(gulp.dest(PATHS.build.assets));
});

/**
 * Scripts | Admin worker (outside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-admin-worker', function() {
  return gulp.src(PATHS.src.assets + 'scripts/customize-worker.js')
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify)))
    .pipe($.concat('customize-worker.min.js', { newLine: '\n' }))
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
    .pipe(gulp.dest(PATHS.build.assets));
});

/**
 * Scripts | Preview (inside iframe)
 *
 * @private
 */
gulp.task('_customize-scripts-preview', function() {
  return gulp.src(PATHS.src.assets + 'scripts/customize-preview.js')
    .pipe($.if(CONFIG.isDist, $.header(CONFIG.credits, { pkg: pkg })))
    .pipe($.if(CONFIG.isDist, $.uglify(PLUGINS.uglify)))
    .pipe($.concat('customize-preview.min.js', { newLine: '\n' }))
    .pipe($.if(CONFIG.isDist, $.stripDebug()))
    .pipe(gulp.dest(PATHS.build.assets));
});
