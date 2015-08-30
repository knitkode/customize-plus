/* jshint node: true */

module.exports = function (grunt) {
  'use strict';

  // project configuration
  grunt.initConfig({

    mkdir: {
      jsduckDocs: 'docs/js/jsduck',
    },
    jsduck: {
      main: {
        src: [
          'src/**/*.js',
          '!**/bower_components/**'
        ],
        dest: 'docs/js/jsduck'
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-jsduck');

  // register tasks
  grunt.registerTask('docs', ['mkdir', 'jsduck']);
};
