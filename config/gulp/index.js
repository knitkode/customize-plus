var fs = require('fs');
var onlyScripts = require('./util/scriptFilter');
var tasks = fs.readdirSync('./config/gulp/tasks/').filter(onlyScripts);

// These variables are intentionally global,
// otherwise we had to redefine them in every single task
gulp = require('gulp');
$ = require('gulp-load-plugins')();

// require each .js file in the tasks folder
tasks.forEach(function(task) {
  require('./tasks/' + task);
});
