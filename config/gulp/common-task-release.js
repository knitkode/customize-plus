/* global gulp, $ */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var PATH_BUILD_BASE = PATHS.build.root || './build';
var pkg = require('../../package.json');
var fs = require('fs');
var path = require('path');
var folders = require('./common-util-get-folders');
var sequence = require('gulp-sequence');
var del = require('del');
var pathMoFiles = [
  './build/languages/*.mo',
  '!./build/languages/' + pkg.config.textDomain + '-*.mo'
];

// @access public
gulp.task('release', sequence([
  'release-prepare',
  'release-lang'
]));

// @access public
gulp.task('release-clean', function () {
  del.sync(PATHS.build.root + '/**');
});

// @access public
gulp.task('release-prepare', ['_release-replace-words', '_release-create-index']);

// @access public
gulp.task('release-lang', ['_release-lang-mo_rename'], function () {
  del.sync(pathMoFiles);
});

// @access private
gulp.task('_release-lang-prepare', ['_release-replace-words'], sequence(['grunt-lang']));

// @access private
gulp.task('_release-lang-mo_rename', ['_release-lang-prepare'], function () {
  return gulp.src(pathMoFiles)
    .pipe($.rename({ prefix: pkg.config.textDomain + '-' }))
    .pipe(gulp.dest('./build/languages/'));
});

/**
 * Replace words task
 *
 * @access public
 */
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

/**
 * Put an index file in each folder of the built project
 * without overriding a possible already existing one.
 *
 * {@link https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md}
 * {@link http://stackoverflow.com/a/30348965/1938970, source(if file exists)}
 */
gulp.task('_release-create-index', function () {
  var fileName = 'index.php';
  var fileContent = '<?php // Silence is golden';
  var indexPaths = [path.join(PATH_BUILD_BASE, fileName)];

  folders(PATH_BUILD_BASE).map(function (folder) {
    indexPaths.push(path.join(PATH_BUILD_BASE, folder, fileName));
  });

  indexPaths.forEach(function (filePath) {
    fs.stat(filePath, function (err) {
      if (err !== null) { // don't overwrite if file is there
        fs.writeFileSync(filePath, fileContent);
      }
    });
  });
});
