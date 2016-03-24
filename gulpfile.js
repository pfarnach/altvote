var gulp 				  = require('gulp');
var browserSync   = require('browser-sync');
var reload 			  = browserSync.reload;
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var concat 			  = require('gulp-concat');
var eslint        = require('gulp-eslint');
var webpack       = require('webpack');
var webpackConfig = require('./webpack.config');


// watch files for changes and reload
gulp.task('serve', ['sass', 'lint', 'webpack'], function() {
	// Browsersync server
  browserSync({
  	notify: false,
  	open: false,
  	port: 8001,
    server: {
      baseDir: './'
    }
  });

  gulp.watch("app/styles/**/*.scss", ['sass']);

  gulp.watch(['**/*.html', '**/*.js'], {cwd: './ui'}, reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/styles/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest("app/styles"))
    .pipe(browserSync.stream());
});

const lintConfig = {
  src: [
    './ui/**/*.js',
    '!./ui/dist/*.js'
  ]
};

gulp.task('lint', function() {
  return gulp.src(lintConfig.src)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('webpack', function(callback) {
  var built = false;

  webpack(webpackConfig)
    .watch(200, function(err, stats) {
      // On the initial compile, let gulp know the task is done
      if (!built) {
        built = true;
        callback();
      }
    });
});

gulp.task('default', ['serve']);