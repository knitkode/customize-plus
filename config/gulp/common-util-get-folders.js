/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Get folders
 *
 * {@link http://stackoverflow.com/a/23398200/1938970 source}
 * @access public
 */
module.exports = function (dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};
