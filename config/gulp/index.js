var fs = require('fs');
var onlyScriptsTasks = require('./common-util-script-filter');
var tasks = fs.readdirSync('./config/gulp/').filter(onlyScriptsTasks);

// These variables are intentionally global,
// otherwise we had to redefine them in every single task
gulp = require('gulp');
$ = require('gulp-load-plugins')();

// require each .js file in the tasks folder
tasks.forEach(function(task) {
  require('./' + task);
});
