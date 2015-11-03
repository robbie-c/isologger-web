'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var browserifyConfig = {
  entries: './src/IsoLoggerWeb.js',
  debug: true,
  standalone: 'IsoLoggerWeb'
};

gulp.task('uglified', function () {
  return browserify(browserifyConfig)
    .bundle()
    .pipe(source('isologgerweb.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('non-uglified', function () {
  return browserify(browserifyConfig)
    .bundle()
    .pipe(source('isologgerweb.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('default', ['uglified', 'non-uglified']);
