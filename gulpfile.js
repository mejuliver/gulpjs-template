//Connect the gulp modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');


//Task for CSS styles
function styles() {
   return gulp.src('./src/sass/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass())
   //Add prefixes
   .pipe(autoprefixer())
   //CSS minification
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('./'))
   //Output folder for styles
   .pipe(gulp.dest('./dist/css'))
   .pipe(browserSync.stream());
}

//Task for JS scripts
function scripts() {
   return gulp.src('./src/js/*.js')
   //JS minification
   .pipe(uglify())
   //Output folder for scripts
   .pipe(gulp.dest('./dist/js'))
   .pipe(browserSync.stream());
}

//Delete all files from specified folder
function clean() {
   return del(['dist/css/*','dist/js/*'])
}

//Watch files
function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  //Watch CSS files
  gulp.watch('./src//**/*.scss', styles);
  //Watch JS files
  gulp.watch('./src/js/**/*.js', scripts);
  //Start synchronization after HTML changing
  gulp.watch("./*.html").on('change', browserSync.reload);
}

//Task calling 'styles' function
gulp.task('styles', styles);
//Task calling 'scripts' function
gulp.task('scripts', scripts);
//Task for cleaning the 'build' folder
gulp.task('del', clean);
//Task for changes tracking
gulp.task('watch', watch);
//Task for cleaning the 'build' folder and running 'styles' and 'scripts' functions
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
//Task launches build and watch task sequentially
gulp.task('dev', gulp.series('build','watch'));
//Default task
gulp.task('default', gulp.series('build','watch'));