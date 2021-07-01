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
const sass = require('gulp-sass')(require('sass'));

const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngcrush = require('imagemin-pngcrush');

//Task for CSS styles
function styles() {
   return gulp.src('./src/sass/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass)
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

  return gulp.src('./src/js/es6babel/*.js')
  .pipe(sourcemaps.init())
  .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(browserSync.stream());

}

function scripts2() {

  return gulp.src('./src/js/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(browserSync.stream());

}

function images(){
   return gulp.src('./src/img/**/*')
   .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true,
      interlaced: true,
      svgoPlugins: [
         { removeTitle: true },
         { removeDesc: { removeAny: true } },
      ],
      use: [
         imageminMozjpeg({ quality: 80 }),
         imageminPngcrush({ reduce: false }),
      ]
   }))
   .pipe(gulp.dest('./dist/img'))
   .pipe(webp())
   .pipe(gulp.dest('./dist/img'))
   .pipe(browserSync.stream()); 
}     

//Delete all files from specified folder
function clean() {
   return del(['dist/css/*','dist/js/*'])
}
function clean2() {
   return del(['dist/img/*']);
}

//Watch files
async function watch() {
  //Watch CSS files
  await gulp.watch('./src/sass/**/*.scss', styles);
  //Watch JS files
  await gulp.watch('./src/js/es6babel/*.js', scripts);
  await gulp.watch('./src/js/*.js', scripts2);
  //Start synchronization after HTML changing
  await gulp.watch("./*.html");

  return;
}

function watchAll() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  //Watch CSS files
  gulp.watch('./src/sass/**/*.scss', styles);
  //Watch JS files
  gulp.watch('./src/js/es6babel/*.js', scripts);
  gulp.watch('./src/js/*.js', scripts2);
  //Start synchronization after HTML changing
  gulp.watch("./*.html").on('change', browserSync.reload);

  return;
}

//Task calling 'styles' function
gulp.task('styles', styles);
//Task calling 'scripts' function
gulp.task('scripts', scripts);
//Task calling 'scripts' function
gulp.task('scripts2', scripts2);
//Task calling 'images' function
gulp.task('images', gulp.series(clean2, images));
//Task for cleaning the 'build' folder
gulp.task('del', gulp.series(clean, clean2));
//Task for changes tracking
gulp.task('watch', watch);
gulp.task('watch-html', watchAll);
//Task for cleaning the 'build' folder and running 'styles' and 'scripts' functions
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,scripts2)));
//Task launches build and watch task sequentially
gulp.task('dev', gulp.series('build','watch-html'));
//Default task
gulp.task('default', gulp.series('build','watch'));