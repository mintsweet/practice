const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('dev', function() {
  nodemon({
    script: 'app.js',
    ignore: ['gulpfile.js', 'node_modules'],
    ext: 'js'
  });
});
