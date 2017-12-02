const jshint = require('gulp-jshint');
const gulp   = require('gulp');
const gutil  = require('gulp-util');
const concat = require('gulp-concat');
var gap = require('gulp-append-prepend');


gulp.task('default', function() {
  return gutil.log('Gulp started')
});


gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('combine', function() {
  return gulp.src([
      "src/maths.js",
      "src/debug.js",
      "src/objects.js",
      "src/components.js",
      "src/time.js",
      "src/input.js",
      "src/display.js",
      "src/collisions.js",
      "src/colliders.js",
      "src/sprites.js",
      "src/engine.js",
      "src/player.js",
      "src/camera.js",
      "src/tilemap.js",
      "src/game.js"
    ])
    .pipe(concat({ path: 'gengine.js'}))
    .pipe(gulp.dest('./dist'));
});

gulp.watch('src/*.js', ['lint', 'combine']);