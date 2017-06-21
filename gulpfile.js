'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let useref = require('gulp-useref');
let browserSync = require('browser-sync').create();
let uglify = require('gulp-uglify');
let gulpIf = require('gulp-if');
let cssnano = require('gulp-cssnano');
let del = require('del');
let runSequence = require('run-sequence');

gulp.task('hello', function() {
  console.log('Hello Stuff');
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('src/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});



gulp.task('watch', function (){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});


gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('./dist'))
});

gulp.task('clean', function() {
  return del.sync('./dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync('dist/**/*');
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync'], 'watch',
    callback
  )
})
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref'],
    callback
  )
})

