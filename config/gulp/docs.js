/* global PLUGINS */
/* jshint node: true */
'use strict';

var PATHS = global.PATHS;
var pathsScriptsToDocument = [
  PATHS.src.scripts + '**/*.js',
  '!' + PATHS.src.scripts + 'temp.js',
  '!' + PATHS.src.scripts + '**/tpl-*.js',
  '!' + PATHS.src.scripts + 'vendor-custom/**/*.js'
];
var pathsScriptsReadyToDocument = './docs/js/scripts-to-document/**/*.js';

const gulp = require('gulp');
const trimlines = require('gulp-trimlines');
const include = require('gulp-include');
const docco = require('gulp-docco');
const jsdoc = require('gulp-jsdoc');


/**
 * Docs
 *
 * @access public
 */
gulp.task('docs', ['_docs-docco', '_docs-jsdoc', '_docs-jsduck']);

/**
 * Docs Prepare Scripts
 *
 * @access private
 */
gulp.task('_docs-prepare-scripts', function() {
  return gulp.src(pathsScriptsToDocument)
    // .pipe(trimlines(PLUGINS.trimlines))
    .pipe(include())
    .pipe(gulp.dest('./docs/js/scripts-to-document'));
});

/**
 * Docs -> docco
 *
 * @access private
 */
gulp.task('_docs-docco', ['_docs-prepare-scripts'], function() {
  return gulp.src(pathsScriptsReadyToDocument)
    .pipe(docco())
    .pipe(gulp.dest('./docs/js/docco'));
});

/**
 * Docs -> jsdoc
 *
 * @access private
 */
gulp.task('_docs-jsdoc', ['_docs-prepare-scripts'], function() {
  // return gulp.src('./docs/js/scripts-to-document/*.js')
  return gulp.src([pathsScriptsReadyToDocument,
    '!./docs/js/scripts-to-document/*.js'])
  // return gulp.src(pathsScriptsReadyToDocument)
    .pipe(jsdoc('./docs/js/jsdoc'));
});

/**
 * Docs -> jsduck
 *
 * @access private
 */
gulp.task('_docs-jsduck', ['_docs-prepare-scripts'], function() {
  var GJSDuck = require('gulp-jsduck');
  var gjsduck = new GJSDuck(['--out', 'docs/js/jsduck']);
  return gulp.src(pathsScriptsReadyToDocument)
        .pipe(gjsduck.doc());
});
