/* global gulp, $ */
/* jshint node: true */
'use strict';

// @access public
gulp.task('default', ['build', 'watch']);

// @access public
gulp.task('all',  $.shell.task([
  'gulp release-clean',
  'gulp build --dist',
  'gulp release-lang',
  'gulp release-prepare',
  'gulp deploy'
]));
