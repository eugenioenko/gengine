const jshint = require('gulp-jshint');
const gulp   = require('gulp');
const gutil  = require('gulp-util');
const concat = require('gulp-concat');
const connect = require('gulp-connect');

gulp.task('default', function() {
  connect.server({
    root: '',
    livereload: true
  });
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
      "src/rect.js",
      "src/utils.js",
      "src/components.js",
      "src/time.js",
      "src/input.js",
      "src/display.js",
      "src/events.js",
      "src/network.js",
      "src/qtree.js",
      "src/collisions.js",
      "src/colliders.js",
      "src/sprite-sheets.js",
      "src/sprites.js",
      "src/animation.js",
      "src/scenes.js",
      "src/stage.js",
      "src/sounds.js",
      "src/engine.js",
      "src/camera.js",
      "src/matrix.js",
      "src/tile.js",
      "src/tilemap.js",
      "src/resources.js",
      "src/player.js"
    ])
    .pipe(concat({ path: 'gengine.js'}))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.watch('src/*.js', [ 'combine']);
gulp.watch('dist/gengine.js', ['lint']);