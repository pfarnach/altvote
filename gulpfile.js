var gulp 				  = require('gulp');
var browserSync   = require('browser-sync');
var reload 			  = browserSync.reload;
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var concat 			  = require('gulp-concat');
var eslint        = require('gulp-eslint');
var webpack       = require('webpack');
var webpackConfig = require('./webpack.config');
var sourcemaps    = require('gulp-sourcemaps');
var cleanCSS      = require('gulp-clean-css');

var stylesConfig = {
  autoprefixer: {
    browsers: ['last 2 version']
  },
  dest: 'ui/styles',
  uiDest: './app/styles',
  settings: {
    data: './styles',
    errToConsole: true,
    includePaths: [
      './ui/styles',
      './ui/vendor'
    ],
    precision: 10,
    indentedSyntax: true,
    outputStyle: 'expanded'
  },
  src: [
    'ui/styles/**/*.scss',
    'ui/styles/**/*.sass'
  ],
  watch: [
    'ui/styles/**/*.scss',
    'ui/styles/**/*.sass'
  ]
};

// watch files for changes and reload
gulp.task('serve', ['styles', 'lint', 'webpack'], function() {
	// Browsersync server
  browserSync({
  	notify: false,
  	open: false,
  	port: 8001,
    server: {
      baseDir: './'
    }
  });

  gulp.watch(stylesConfig.watch, ['styles']);

  gulp.watch(['**/*.html', '**/*.js'], {cwd: './ui'}, reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function() {
  return gulp.src(stylesConfig.src)
    .pipe(sourcemaps.init())
    .pipe(sass(stylesConfig.settings))
    .pipe(autoprefixer(stylesConfig.autoprefixer))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(stylesConfig.dest))
    .pipe(gulp.dest(stylesConfig.uiDest))
    .pipe(browserSync.reload({
      stream: true
    }));
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