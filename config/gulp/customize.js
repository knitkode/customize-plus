const paths = require('../dev-lib/paths');
const config = require('../dev-lib/config');
const plugins = require('../dev-lib/gulp/plugins');
const pkg = require(paths.join(paths.ROOT, 'package.json'));
const fs = require('fs');
const StreamQueue = require('streamqueue');
const extend = require('deep-extend');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const stripDebug = require('gulp-strip-debug');
const modernizr = require('gulp-modernizr');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const replace = require('gulp-replace');
const header = require('gulp-header');
const concat = require('gulp-concat');

/**
 * Base tasks (build, docs, and watch)
 */
module.exports = {
  build: function customizeBuild (callback) {
    return gulp.parallel(
      gulp.series(
        scriptsAdminRollup,
        scriptsModernizer,
        scriptsAdmin
      ),
      scriptsPreview,
    )(callback);
  },
  watch: function customizeWatch () {
    gulp.watch([
      paths.join(paths.ROOT, 'package.json'),
      paths.join(paths.src.scripts, '**/*.js')
    ], gulp.parallel(
      gulp.series(
        scriptsAdminRollup,
        scriptsAdmin
      ),
      scriptsPreview,
    ));
  },
  docs: function customizeDocs (callback) {
    return gulp.parallel(
      // docsJs,
      esdoc,
      // documentationJs
    )(callback);
  },
}

const globals = {
  window: 'window',
  document: 'document',
  jquery: 'jQuery',
  underscore: '_',
  wp: 'wp',
  kkcp: 'kkcp',
  modernizr: 'Modernizr',
  marked: 'marked',
  hljs: 'hljs',
}

/**
 * Scripts Admin Rollup
 *
 * Use the customize/index.js` as entry point and resolve from there.
 */
function scriptsAdminRollup () {
  return require('rollup').rollup({
    input: paths.join(paths.src.scripts, 'customize/index.js'),
    external: Object.keys(globals),
    plugins: [
      require('rollup-plugin-node-resolve')({
        jsnext: true,
        main: true,
        browser: true,
      }),
      require('rollup-plugin-commonjs')({
        include: paths.join(paths.ROOT, 'node_modules/**')
      }),
      require('rollup-plugin-flow')({ pretty: true }),

      // Using buble instead of babel allows the private classmethods to be
      // mangled since the latter uses the "key: _methodName" transformation
      // that the minfier cannot mangle
      // In case we want to switch to babel we would need to:
      // `yarn add rollup-plugin-babel @babel/preset-env --dev && yarn remove 
      // rollup-plugin-buble`
      require('rollup-plugin-buble')(),
      // require('rollup-plugin-babel')({
      //   exclude: 'node_modules/**',
      //   babelrc: false,
      //   presets: ['@babel/preset-env'],
      //   comments: false,
      // }),
    ]})
    .then((bundle) => {
      return bundle.write(extend({
        format: 'iife',
        indent: '  ',
        intro: 'var DEBUG = true;',
        globals,
        interop: false,
      }, {
        file: '.tmp/customize.js'
      }));
    });
}

/**
 * Scripts Admin (outside iframe)
 *
 * Manage libraries and custom scripts concating and minifying everything
 * together with right licenses headers and stripping DEBUG code.
 */
function scriptsAdmin () {
  const stream = new StreamQueue({ objectMode: true });

  stream.queue(gulp.src([
    `${paths.src.npm}/classlist.js/classList.js`, // @@ie9 @@ie8 \\
    `${paths.src.npm}/@knitkode/vendor/cp/modernizr-custom.js`,
    `${paths.src.npm}/@knitkode/vendor/cp/highlight.pack.js`,
    `${paths.src.npm}/marked/lib/marked.js`, // @@doubt or use http://git.io/vZ05a \\
    `${paths.src.npm}/jQuery-ui-Slider-Pips/dist/jquery-ui-slider-pips.js`, // @@todo, this is actually needed only in the layout_columns control... so maybe put it in the theme... \\
    `${paths.src.npm}/selectize/dist/js/standalone/selectize.js`,
    `${paths.src.npm}/spectrum-colorpicker/spectrum.js`,
  ]));
  stream.queue(gulp.src('.tmp/customize.js')
    .pipe(gulpIf(config.isDist, replace('var DEBUG = true;', 'var DEBUG = !!window.kkcp.DEBUG;')))
    .pipe(gulpIf(config.isDist, header(config.credits, { pkg: pkg })))
  );
  return stream.done()
    .pipe(concat('customize.js', plugins.concat))
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpIf(config.isDist, replace('var DEBUG = !!window.kkcp.DEBUG;', '')))

    .pipe(gulpIf(config.isDist, terser(extend({}, plugins.uglify, plugins.uglifyCustomScripts, {
      output: {
        // just keep the comment with License
        // this regex should work but it doesn't: /[\s\S]*\/\*\![\s\S]*(license)/gi
        comments: (node, comment) => /license/gi.test(comment.value)
      },
      nameCache: JSON.parse(fs.readFileSync(
        paths.join(paths.ROOT, '../customize-plus-premium/config/minifier--customize-name_cache.json'),
      'utf8')),
      })
    )))
    .pipe(gulp.dest(paths.dist.scripts));
}

/**
 * Scripts Preview (inside iframe)
 */
function scriptsPreview () {
  return gulp.src(paths.join(paths.src.scripts, 'customize-preview.js'))
    .pipe(concat('customize-preview.js', plugins.concat))
    .pipe(gulpIf(config.isDist, header(config.credits, { pkg: pkg })))
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe(gulpIf(config.isDist, replace('var DEBUG = true;', ''))) // or var DEBUG = !!api.DEBUG;
    .pipe(gulpIf(config.isDist, terser(plugins.uglify)))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.scripts));
}

/**
 * Modernizr custom build
 */
function scriptsModernizer () {
  var modernizrOpts = extend(plugins.modernizr, {
    'tests' : [ 'cssanimations', 'csstransforms', 'filereader', 'svg', 'webworkers' ]
  });
  // the src path is just needed by gulp but we don't want gulp-modernizr to
  // automatically look for tests to do, we just defined them here above
  return gulp.src(paths.join(paths.src.scripts, 'customize/index.js'))
    .pipe(modernizr(modernizrOpts))
    .pipe(rename('modernizr-custom.js'))
    // .pipe(gulp.dest(paths.join(paths.src.scripts, 'vendor-custom')));
    .pipe(gulp.dest(`${paths.src.npm}/@knitkode/vendor/cp/`));
}

/**
 * Docs JS
 */
function docsJs (cb) {
  const jsdoc = require('gulp-jsdoc3');

  return gulp.src([
      paths.join(paths.ROOT, 'README.md'),
      paths.join(paths.src.scripts, 'customize/**/*.js'),
    ])
    .pipe(jsdoc({
        opts: {
          destination: paths.join(paths.ROOT, pkg.config.paths.docsJsDest),
          private: true,
        },
        templates: {
          theme: 'simplex',
          // footer: '',
          // copyright: '',
          // analytics: { ua: '', domain: '' },
        },
        source: {
          excludePattern: '(^|\\/|\\\\)_'
        }
      }));
}

function esdoc(callback) {
  const esdoc = require('gulp-esdoc');
 
  return gulp.src([
      // paths.join(paths.ROOT, 'README.md'),
      paths.join(paths.src.scripts, 'customize'),
    ])
    .pipe(esdoc({
      destination: paths.join(paths.ROOT, pkg.config.paths.esdocDest),
      'includes': ['\\.js$'],
    }));
}

function documentationJs(callback) {
  const documentation = require('gulp-documentation');

  return gulp
    .src([
      paths.join(paths.src.scripts, "customize/**/*.js"),
      paths.join("!" + paths.src.scripts, "customize/**/_*.js")
    ])
    .pipe(documentation("html", {}, {}))
    // .pipe(documentation("md"))
    // .pipe(documentation("json"))
    .pipe(gulp.dest(paths.join(paths.ROOT, pkg.config.paths.documentationJsDest)));
}
