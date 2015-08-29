/* jshint node: true */
'use strict';

/**
 * Gulp Plugins shared options
 * @type {Object}
 */
module.exports = {
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
    preserveComments: 'some', // --comments
    toplevel: true,
    mangle: true, // --mangle
    compress: {
      drop_console: true, // --compress drop_console=true
      global_defs: {
        DEBUG: false // --define DEBUG=false
      }
    }
  },
  uglifyCustomScripts: { // @@temp see readme... \\
    mangleProps: true, // --mangle-props
    mangleRegex: '/^_/', // --mangle-regex='/^_/'
    reserveDomprops: true // --reserve-domprops
    // --name-cache .tmp/uglify-cache.json
  },
  concat: {
    newLine: '\n\n\n'
  },
  autoprefixer: 'last 2 version',
  jsonEditor: {
    'indent_char': ' ',
    'indent_size': 2
  },
  // https://www.npmjs.com/package/gulp-trimlines
  trimlines: {
    leading: false
  },
  // http://jscs.info/overview#options
  jscs: {
    configPath: '.jscsrc',
    fix: true
  }
};
