const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');

const PATH = {
  image: {
    src: './public/images/**/*',
    dist: './dist/img'
  },
  style: {
    src: './public/styles/**/*.less',
    dist: './dist/css'
  },
  script: {
    src: './public/scripts/**/*.js',
    dist: './dist/js'
  },
  vendor: {
    src: './public/vendor/**/*.js',
    dist: './dist/lib'
  },
  font: {
    src: './public/font/**/*',
    dist: './dist/font'
  }
};

function image() {
  return gulp.src(PATH.image.src)
    .pipe(imagemin())
    .pipe(gulp.dest(PATH.image.dist));
}

function style() {
  return gulp.src(PATH.style.src)
    .pipe(less())
    .pipe(gulp.dest(PATH.style.dist));
}

function script() {
  return gulp.src(PATH.script.src)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.script.dist));
}

function vendor() {
  return gulp.src(PATH.vendor.src)
    .pipe(gulp.dest(PATH.vendor.dist));
}

function font() {
  return gulp.src(PATH.font.src)
    .pipe(gulp.dest(PATH.font.dist));
}

function watch(done) {
  gulp.watch(PATH.image.src, image);
  gulp.watch(PATH.style.src, style);
  gulp.watch(PATH.script.src, script);
  gulp.watch(PATH.vendor.src, vendor);
  gulp.watch(PATH.font.src, font);
  done();
}

function dev(done) {
  nodemon({
    script: 'app.js',
    ignore: ['gulpfile.js', 'node_modules'],
    ext: 'js'
  });
  done();
}

function clean() {
  return del(['dist']);
}

const build = gulp.series(clean, gulp.parallel(image, style, script, vendor, font));

exports.image = image;
exports.style = style;
exports.script = script;
exports.vendor = vendor;
exports.font = font;

exports.watch = watch;
exports.clean = clean;
exports.build = build;

exports.default = gulp.series(build, dev, watch);
