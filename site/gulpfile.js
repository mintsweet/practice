const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

gulp.task('sass', () => {
  gulp.src('./public/sass/index.scss')
    .pipe($.sass({
      includePaths: [path.join(__dirname, './public/sass/**/*.scss')],
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', () => {
  gulp.src('./public/js/**/*.js')
    .pipe($.babel({ presets: ['env'] }))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('img', () => {
  gulp.src('./public/img/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('lib', () => {
  gulp.src('./public/lib/**/*')
    .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('font', () => {
  gulp.src('./public/font/**/*')
    .pipe(gulp.dest('./dist/font/'));
});

gulp.task('watch', () => {
  gulp.watch('./public/sass/**/*.scss', ['sass']);
  gulp.watch('./public/js/**/*.js', ['js']);
  gulp.watch('./public/img/**/*', ['img']);
  gulp.watch('./public/lib/**/*', ['lib']);
  gulp.watch('./public/font/**/*', ['font']);
});

gulp.task('build', ['sass', 'js', 'img', 'lib', 'font']);

gulp.task('dev', ['sass', 'js', 'img', 'lib', 'font', 'watch'], function() {
  $.nodemon({
    script: 'app.js',
    ignore: ['gulpfile.js', 'node_modules', 'dist', 'public'],
    ext: 'js'
  });
});

gulp.task('default', ['dev']);

gulp.task('clean', () => {
  gulp.src('./dist')
    .pipe($.clean());
});
