'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const include = require('gulp-include');
const addsrc = require('gulp-add-src');
const order = require('gulp-order');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('javascript', function() {
  return gulp.src('javascripts/application/*.js')
    .pipe(addsrc('javascripts/vendor/index.js'))
    .pipe(order([
      "javascripts/vendor/index.js",
      "javascripts/application/*.js"
    ], {base: '.'}))
    .pipe(include())
    .pipe(concat('application.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('javascripts'));
});

gulp.task('watch', function() {
  gulp.watch('javascripts/application/*.js', ['javascript']);
});
