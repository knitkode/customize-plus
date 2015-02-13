/* global gulp, require, CONFIG, PLUGINS */

/**
 * Config informations
 * @type {Object}
 */
module.exports = CONFIG = {
  credits: [
    '/*!',
    ' * <%= pkg.config.namePretty %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * <%= pkg.description %>',
    ' * Copyright <%= pkg.config.startYear %><% if (new Date().getFullYear() > pkg.config.startYear) { %>-<%= new Date().getFullYear() %><% } %> <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)',
    ' * <%= pkg.license.type %> (<%= pkg.license.url %>)',
    ' */'
  ].join('\n'),
  argv: require('minimist')(process.argv.slice(2)),
  isDist: !!require('minimist')(process.argv.slice(2)).dist, // read --dist arg (i.e. `gulp build --dist`)
};

/**
 * Gulp Plugins shared options
 * @type {Object}
 */
module.exports = PLUGINS = {
  // gulp-modernizr shared options
  modernizr: {
    'cache' : true,
    'options': [ // Based on default settings on http://modernizr.com/download/
      'setClasses',
      'addTest',
      'testProp',
      'fnBind'
    ],
    'excludeTests': [],
    'crawl' : false,
    'customTests' : []
  },
  uglify: {
    preserveComments: 'some',
    toplevel: true,
    mangle: true
  }
};

/**
 * Paths
 * @type {Object}
 */
module.exports = PATHS = {
  /** @type {String} */
  bower: './bower_components/',
  /** @type {Object} */
  src: {
    root: './src/',
    vendor: './src/vendor/',
    includes: './src/includes/',
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
  'build-customize',
  // 'build-welcome'
]);

// @public
gulp.task('watch', [
  'watch-base',
  'watch-customize',
  // 'watch-welcome',
  // 'watch-tools',
]);

// @public
gulp.task('help', require('gulp-task-listing'));

// @public
gulp.task('modernizr', ['_customize-modernizr']);

// Require the gulp folder with all the tasks, don't change this
require('./config/gulp');