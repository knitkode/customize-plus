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
    .pipe($.if(CONFIG.isDist, $.replace('pkgVersion', pkg.version, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgHomepage', pkg.homepage, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgNamePretty', pkg.config.namePretty, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgNameShort', pkg.config.nameShort, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgName', pkg.name, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgDescription', pkg.description, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgAuthorName', pkg.author.name, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgAuthorEmail', pkg.author.email, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgAuthorUrl', pkg.author.url, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgLicenseType', pkg.license.type, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgLicenseUrl', pkg.license.url, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgConfigTags', tags.join(', '), options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgTextdomain', pkg.config.textDomain, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgConfigStartYear', pkg.config.startYear, options)))
    .pipe($.if(CONFIG.isDist, $.replace('pkgConfigEndYear', pkgConfigEndYear, options)))
    // delete all code annotations, regex matches: ' // @@ ....single/multi line content \\
    .pipe($.if(CONFIG.isDist, $.replace(/(\s?\/\/\s@@(?:(?!\\\\)[\s\S])*\s\\\\)/g, '', options)))
    .pipe(gulp.dest(PATHS.build.root));
});
