var fs = require('fs');

var browserSync = require('browser-sync');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');  // Temporary solution until Gulp 4
                                            // https://github.com/gulpjs/gulp/issues/355

var reload = browserSync.reload;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean', function (done) {
    require('del')(['build'], done);
});

gulp.task('copy', [
    'copy:css',
    'copy:html',
    'copy:misc'
]);

gulp.task('copy:css', function () {
    return gulp.src('src/css/all.scss')
               .pipe(plugins.rubySass())
               .pipe(gulp.dest('build/css'))
               .pipe(plugins.filter('**/*.css'))
               .pipe(reload({stream: true}));
});

gulp.task('copy:html', function () {
    return gulp.src([

        // Copy all `.html` files
        'src/*.html',

        // Exclude the following files since they
        // are only used to build the other files
        '!src/masthead.html',
        '!src/base.html'

    ]).pipe(plugins.swig({
            defaults: { cache: false },
            data: JSON.parse(fs.readFileSync("./src/data.json"))
       }))
      .pipe(plugins.htmlmin({

            // In-depth information about the options:
            // https://github.com/kangax/html-minifier#options-quick-reference

            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,

            // Prevent html-minifier from breaking the SVGs
            // https://github.com/kangax/html-minifier/issues/285
            keepClosingSlash: true,
            caseSensitive: true

      })).pipe(gulp.dest('build'))
         .pipe(reload({stream: true}));
});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        'src/**',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!src/*.html',
        '!src/{css,css/**}',
        '!src/data.json'

    ], {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest('build'));

});

gulp.task('browser-sync', function() {
     browserSync({

        // In-depth information about the options:
        // http://www.browsersync.io/docs/options/

        notify: false,
        port: 8000,
        server: "build"

    });
});

gulp.task('watch', function () {
    gulp.watch(['src/**/*.scss'], ['copy:css']);
    gulp.watch(['src/*.html', 'src/data.json'], ['copy:html', reload]);
    gulp.watch(['src/img/**', 'src/demos/**'], ['copy:misc', reload]);
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
    runSequence('clean', 'copy', done);
});

gulp.task('default', ['build']);

gulp.task('serve', function (done) {
    runSequence( 'build', ['browser-sync', 'watch'], done);
});
