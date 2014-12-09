var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var buffer = require('gulp-buffer');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var hbsfy = require('hbsfy');
var browserify = require('browserify');
var app = require('./server');
var urlSrc = require('./url-src');
var path = require('path');
var es = require('event-stream');
var fs = require('fs');

var jsEntryPoints = [
];

function sassTask(dev) {
  return gulp.src('www/static/css/*.scss')
    .pipe(sass({
      sourcemap: dev,
      style: 'compressed'
    }))
    .pipe(gulp.dest('www/static/css/'));
}

gulp.task('sass', function() {
  return sassTask(true);
});

gulp.task('sass-build', function() {
  return sassTask(false);
});

function jsTask(bundler, dest, dev) {
  var stream = bundler.bundle({
    debug: dev
  }).pipe(source('all.js'));

  if (!dev) {
    stream = stream.pipe(buffer()).pipe(uglify());
  }
  return stream.pipe(gulp.dest(dest));
}

function makeBundler(func, path) {
  return func(path).transform(hbsfy);
}

gulp.task('js-build', function() {
  var streams = jsEntryPoints.map(function(jsPath) {
    return jsTask(makeBundler(browserify, jsPath), path.dirname(jsPath), false);
  });

  return es.merge.apply(es, streams);
});

gulp.task('watch', ['sass'], function() {
  // sass
  gulp.watch('www/static/css/**/*.scss', ['sass']);

  // js
  var streams = jsEntryPoints.map(function(jsPath) {
    var bundler = makeBundler(watchify, jsPath);
    bundler.on('update', rebundle);
    function rebundle() {
      return jsTask(bundler, path.dirname(jsPath), true);
    }
    return rebundle();
  });

  return es.merge.apply(es, streams);
});

gulp.task('server', function() {
  app.listen(3000);
});

gulp.task('clean', function() {
  gulp.src('build/*', {read: false})
    .pipe(clean());
});

function getDeepDirContentsSync(path) {
  var paths = [];

  fs.readdirSync(path).filter(function(name) {
    return name.slice(0,1) != '.';
  }).forEach(function(name) {
    var newPath = path + '/' + name;
    if (fs.statSync(newPath).isDirectory()) {
      paths = paths.concat(getDeepDirContentsSync(newPath));
    }
    else {
      paths.push(newPath);
    }
  });

  return paths;
}

gulp.task('build', ['clean', 'sass-build'], function() {
  var server = app.listen(3000);
  var writeStream = gulp.dest('build/');
  var urls = [
    '',
    'resources.html',
    'static/css/all.css',
    'static/css/imgs/canary.png',
    'static/css/imgs/chrome.png',
    'static/css/imgs/firefox-nightly.png',
    'static/css/imgs/firefox.png',
    'static/css/imgs/ie.png',
    'static/css/imgs/opera.png',
    'static/css/imgs/opera-developer.png',
    'static/css/imgs/safari.png',
    'static/css/imgs/webkit-nightly.png'
  ];

  urls = urls.concat(
    getDeepDirContentsSync(__dirname + '/www/demos').map(function(path) {
      return path.slice((__dirname + '/www/').length);
    })
  );

  writeStream.on('end', server.close.bind(server));

  return urlSrc('http://localhost:3000/isserviceworkerready/', urls).pipe(writeStream);
});

gulp.task('default', ['watch', 'server']);
