/* global gulp, $ */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var CONFIG = require('./common-config');

/**
 * Replace words task
 *
 */
// @access public
gulp.task('_release-replace-words', function () {
  var options = { skipBinary: true };
  var pkg = require('../../package.json');
  var pkgConfigEndYear = (new Date().getFullYear() > pkg.config.startYear) ? new Date().getFullYear() : '';
  var tags = pkg.config.tags || [];
  return gulp.src([
      PATHS.build.root + '/**/*.*',
      '!' + PATHS.build.root + '/**/vendor/**.*'
    ], { base: PATHS.build.root })
    .pipe($.replace('pkgVersion', pkg.version, options))
    .pipe($.replace('pkgHomepage', pkg.homepage, options))
    .pipe($.replace('pkgNamePretty', pkg.config.namePretty, options))
    .pipe($.replace('pkgNameShort', pkg.config.nameShort, options))
    .pipe($.replace('pkgName', pkg.name, options))
    .pipe($.replace('pkgDescription', pkg.description, options))
    .pipe($.replace('pkgAuthorName', pkg.author.name, options))
    .pipe($.replace('pkgAuthorEmail', pkg.author.email, options))
    .pipe($.replace('pkgAuthorUrl', pkg.author.url, options))
    .pipe($.replace('pkgLicenseType', pkg.license.type, options))
    .pipe($.replace('pkgLicenseUrl', pkg.license.url, options))
    .pipe($.replace('pkgConfigTags', tags.join(', '), options))
    .pipe($.replace('pkgTextDomain', pkg.config.textDomain, options))
    .pipe($.replace('pkgConfigStartYear', pkg.config.startYear, options))
    .pipe($.replace('pkgConfigEndYear', pkgConfigEndYear, options))
    // delete all code annotations, regex matches: ' // @@ ....single/multi line content \\
    .pipe($.replace(/(\s?\/\/\s@@(?:(?!\\\\)[\s\S])*\s\\\\)/g, '', options))
    .pipe(gulp.dest(PATHS.build.root));
});
