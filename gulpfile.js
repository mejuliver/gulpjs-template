//Connect the gulp modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

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
  .pipe(sourcemaps.init())
  .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(browserSync.stream());
}

function images(){
   return gulp.src('./src/img/*')
   .pipe(imagemin())
   .pipe(gulp.dest('./dist/img'))
   .pipe(webp())
   .pipe(gulp.dest('./dist/img'))
   .pipe(browserSync.stream()); 
}     

//Delete all files from specified folder
function clean() {
   return del(['dist/css/*','dist/js/*','dist/img/*'])
}

//Watch files
function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  //Watch CSS files
  gulp.watch('./src/sass/**/*.scss', styles);
  //Watch JS files
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/img/*', images);
  //Start synchronization after HTML changing
  gulp.watch("./*.html").on('change', browserSync.reload);
}

//Task calling 'styles' function
gulp.task('styles', styles);
//Task calling 'scripts' function
gulp.task('scripts', scripts);
//Task calling 'images' function
gulp.task('images', images);
//Task for cleaning the 'build' folder
gulp.task('del', clean);
//Task for changes tracking
gulp.task('watch', watch);
//Task for cleaning the 'build' folder and running 'styles' and 'scripts' functions
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,images)));
//Task launches build and watch task sequentially
gulp.task('dev', gulp.series('build','watch'));
//Default task
gulp.task('default', gulp.series('build','watch'));