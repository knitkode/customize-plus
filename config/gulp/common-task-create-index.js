/* global gulp */
/* jshint node: true */
'use strict';

var PATH_BUILD_BASE = global.PATHS.build.root || './build';
var fs = require('fs');
var path = require('path');
var folders = require('./common-util-get-folders');

/**
 * Put an index file in each folder of the built project
 * without overriding a possible already existing one.
 *
 * @link(https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md)
 * @link(http://stackoverflow.com/a/30348965/1938970, source(if file exists))
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
