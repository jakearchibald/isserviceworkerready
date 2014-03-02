var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserify = require('gulp-browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var server = require('./server');

gulp.task('sass', function() {
  gulp.src('www/static/css/*.scss')
    .pipe(sass({
      sourcemap: true,
      style: 'compressed'
    }))
    .pipe(gulp.dest('www/static/css/'));
});

gulp.task('watch', ['sass'], function() {
  // sass
  gulp.watch('www/static/css/**/*.scss', ['sass']);

  // js
  var bundler = watchify('./www/static/js/index.js');

  bundler.on('update', rebundle);

  function rebundle () {
    return bundler.bundle({
      debug: true
    }).pipe(source('all.js'))
      .pipe(gulp.dest('www/static/js/'));
  }

  return rebundle();
});

gulp.task('server', function() {
  server.listen(3000);
});

gulp.task('default', ['watch', 'server']);