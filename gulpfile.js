const gulp = require('gulp')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const clean = require('gulp-clean')
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-minify-css');

const gulpfn = require('gulp-fn')
const fs = require('fs');

const util = require('gulp-util');
let config = { production: !!util.env.production }

gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean())
        .pipe(gulpfn(function (file) { 
            if (!fs.existsSync('build')){
                fs.mkdirSync('build');
            } 
        }));    
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./build"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('styles', function(){
  gulp.src(['source/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/styles/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(config.production ? minifyCSS() : util.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
  return gulp.src('source/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(babel({presets: ['es2015', 'es2016']}))
    .pipe(gulp.dest('build/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(config.production ? uglify() : util.noop())
    .pipe(gulp.dest('build/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('external-scss', function(){
  gulp.src(['external/font-awesome-4.7.0/scss/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/external/font-awesome-4.7.0/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(config.production ? minifyCSS() : util.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/external/font-awesome-4.7.0/css/'))
    .pipe(browserSync.reload({stream:true}))
});

const STATIC_STYLES = ['source/styles/**/*.css']
const STATIC_HYPERTEXT = ['source/**/*!template.html', 'source/**/*.html']
const STATIC_TEMPLATES = ['source/templates/*.template.html']

gulp.task('static-sources', function(){
  gulp.src(STATIC_STYLES)
      .pipe(gulp.dest('build/styles/'))
  return gulp.src(STATIC_HYPERTEXT)
      .pipe(gulp.dest('build/'))
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'external-scss', 'static-sources'], function(){
  gulp.src(['external/font-awesome-4.7.0/fonts/fontawesome-webfont.*']).pipe(gulp.dest('build/external/font-awesome-4.7.0/fonts'));
  gulp.src( 'external/font-awesome-4.7.0/scss/*.scss', ['external-scss']);

  gulp.src(['external/fccfavicons-master/*']).pipe(gulp.dest('build/external/fccfavicons-master'));

  gulp.src(['node_modules/jquery/dist/*']).pipe(gulp.dest('build/external/jquery/dist'));

  gulp.src(['node_modules/lodash/**/*']).pipe(gulp.dest('build/external/lodash'));

  gulp.src(['node_modules/normalize.css/*.css']).pipe(gulp.dest('build/external/normalize.css'));

  gulp.watch('source/styles/**/*.scss', ['styles']);
  gulp.watch('source/scripts/**/*.js', ['scripts']);

  let static_sources = []
  static_sources.push(...STATIC_HYPERTEXT)
  static_sources.push(...STATIC_STYLES)
  gulp.watch(static_sources, ['static-sources']);

  gulp.watch('*.html', ['bs-reload']);
});
