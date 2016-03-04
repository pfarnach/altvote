var gulp 				 = require('gulp');
var browserSync  = require('browser-sync');
var reload 			 = browserSync.reload;
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat 			 = require('gulp-concat');


// watch files for changes and reload
gulp.task('serve', ['sass'], function() {
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

  gulp.watch(['**/*.html', '**/*.js'], {cwd: './'}, reload);
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

gulp.task('default', ['serve']);