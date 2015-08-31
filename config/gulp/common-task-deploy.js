/* global gulp */
/* jshint node: true */
'use strict';

// @access public
gulp.task('deploy', ['_deploy-build']);

// @access private
gulp.task('_deploy-copy_basic_files', function () {
  return gulp.src(['./license.txt', './readme.txt'])
    .pipe(gulp.dest('./build'))
});

// @access private
gulp.task('_deploy-build', ['_deploy-copy_basic_files'], function () {
  return gulp.src('./build/**/*')
    .pipe($.ghPages({
      branch: 'trunk'
    }));
});
