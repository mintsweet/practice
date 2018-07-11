const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const srcPath = 'public';
const prdPath = 'dist';

gulp.task('sass', () => {
  gulp.src(`${srcPath}/sass/index.scss`)
    .pipe($.sass({ outputStyle: 'compressed' }).on('error', $.sass.logError))
    .pipe(gulp.dest(`${prdPath}/css/`));
});

gulp.task('js', () => {
  gulp.src(`${srcPath}/js/**/*.js`)
    .pipe($.babel({ presets: ['env'] }))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(`${prdPath}/js/`));
});

gulp.task('img', () => {
  gulp.src(`${srcPath}/img/**/*`)
    .pipe($.imagemin())
    .pipe(gulp.dest(`${prdPath}/img/`));
});

gulp.task('lib', () => {
  gulp.src(`${srcPath}/lib/**/*`)
    .pipe(gulp.dest(`${prdPath}/lib/`));
});

gulp.task('font', () => {
  gulp.src(`${srcPath}/font/**/*`)
    .pipe(gulp.dest(`${prdPath}/font/`));
});

gulp.task('watch', () => {
  gulp.watch(`${srcPath}/sass/**/*.scss`, ['sass']);
  gulp.watch(`${srcPath}/js/**/*.js`, ['js']);
  // gulp.watch(`${srcPath}/img/**/*`, ['img']);
  // gulp.watch(`${srcPath}/lib/**/*`, ['lib']);
  gulp.watch(`${srcPath}/font/**/*`, ['font']);
});

gulp.task('build', ['sass', 'js', 'img', 'lib', 'font']);

gulp.task('dev', ['sass', 'js', 'img', 'lib', 'font', 'watch'], function() {
  $.nodemon({
    script: 'app.js',
    gnore: ['gulpfile.js', 'node_modules'],
    ext: 'js pug'
  });
});

gulp.task('default', ['dev']);

gulp.task('clean', () => {
  gulp.src(prdPath)
    .pipe($.clean());
});
