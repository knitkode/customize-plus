const gulp = require('gulp');
const wpRelease = require('./dev-lib/gulp/wpRelease');
const wpDeploy = require('./dev-lib/gulp/wpDeploy');
const wpPublishSvn = require('./dev-lib/gulp/wpPublishSvn');
const wpTagVersion = require('./dev-lib/gulp/wpTagVersion');
const base = require('./gulp/base');
const customize = require('./gulp/customize');

// Public tasks
gulp.task('build', gulp.parallel(base.build, customize.build, customize.docs));
gulp.task('watch', gulp.series('build', gulp.parallel(base.watch, customize.watch)));
gulp.task('deploy', gulp.series('build', wpRelease, wpDeploy));
gulp.task('publish', gulp.series(wpPublishSvn, wpTagVersion));