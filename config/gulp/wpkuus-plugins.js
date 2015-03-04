/* jshint node: true */

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
    preserveComments: 'some',
    toplevel: true,
    mangle: true
  },
  autoprefixer: 'last 2 version',
  jsonEditor: {
    'indent_char': ' ',
    'indent_size': 2
  }
};
