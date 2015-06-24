/* global gulp, $ */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var PLUGINS = require('./common-plugins');
var streamqueue = require('streamqueue');


/**
 * Scripts | Compare level of minification between uglify and closure compiler
 *
 * @private
 */
gulp.task('_test-js', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.include())
    .pipe($.replace('var DEBUG = true;', 'var DEBUG = false;'))
    .pipe($.closureCompiler({
      compilerPath: 'src/assets/bower_components/closure-compiler/compiler.jar',
      fileName: 'customize.js',
      compilerFlags: {
        // closure_entry_point: 'app.main',
        // compilation_level: 'ADVANCED_OPTIMIZATIONS',
      }
    }))
    .pipe($.rename({ prefix: 'test-', suffix: '-closure' }))
  );
  stream.queue(gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.include())
    .pipe($.replace('var DEBUG = true;', 'var DEBUG = false;'))
    .pipe($.closureCompiler({
      compilerPath: 'src/assets/bower_components/closure-compiler/compiler.jar',
      fileName: 'customize.js',
      compilerFlags: {
        // closure_entry_point: 'app.main',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
      }
    }))
    .pipe($.rename({ prefix: 'test-', suffix: '-closure-advanced' }))
  );
  stream.queue(gulp.src(PATHS.src.scripts + 'customize.js')
    .pipe($.include())
    .pipe($.replace('var DEBUG = true;', ''))
    .pipe($.uglify(PLUGINS.uglify))
    .pipe($.rename({ prefix: 'test-', suffix: '-uglify' }))
  );
  return stream.done()
    .pipe(gulp.dest('tmp-test'));
});
