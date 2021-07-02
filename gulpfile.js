//Connect the gulp modules
const { src, parallel, task, dest, watch, series } = require('gulp');
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
   return src('./src/sass/**/*.scss')
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
   .pipe(dest('./dist/css'))
   .pipe(browserSync.stream());
}

//Task for JS scripts
function scriptsES6() {
   return src('./src/js/es6babel/*.js')
  .pipe(sourcemaps.init())
  .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(dest('./dist/js'))
  .pipe(browserSync.stream());
}

function scripts(){
   return src('./src/js/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(dest('./dist/js'))
  .pipe(browserSync.stream());
}

function images(){
   return src('./src/img/**/*')
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
   .pipe(dest('./dist/img'))
   .pipe(webp())
   .pipe(dest('./dist/img'));
}     

//Delete all files from specified folder
function clean() {
   return del(['dist/css/*','dist/js/*'])
}
function cleanImgs() {
   return del(['dist/img/*']);
}

//Watch files
function watchFiles() {
  //Watch CSS files
  watch('./src/sass/**/*.scss', styles);
  //Watch JS files
  watch('./src/js/es6babel/*.js', scriptsES6);
  watch('./src/js/*.js', scripts);
}

function watchHTML(){
   browserSync.init({
      server: {
          baseDir: "./"
      }
   });
   
   return watch("./*.html").on('change', browserSync.reload);
}

function watchStyles(){
   return watch('./src/sass/**/*.scss', styles);
}

function watchScripts(){
   return watch('./src/js/*.js', scripts);
}

function watchScriptsES6(){
   return watch('./src/js/es6babel/*.js', scriptsES6);
}

//Task calling 'styles' function
task('styles', styles);
//Task calling 'scripts' function
task('scripts', series(scripts,scriptsES6)) ;
//Task calling 'images' function
task('images', series(cleanImgs, images));
//Task for cleaning the 'build' folder
task('del', series(clean, cleanImgs));
//Task for changes tracking
task('watch', parallel(watchStyles,watchScripts,watchScriptsES6));
task('watch-all', parallel(watchStyles,watchScripts,watchScriptsES6,watchHTML));
//Task for cleaning the 'build' folder and running 'styles' and 'scripts' functions
task('build', series(clean, parallel(styles,scripts,scriptsES6)));
//Task launches build and watch task sequentially
//Default task
task('default', series('build','watch-all'));