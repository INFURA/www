
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    package = require('./package.json'),
    htmlmin = require('gulp-htmlmin'),
    gulpif = require('gulp-if'),
    sprity = require('sprity'),
    svgmin = require('gulp-svgmin'),
    injectSvg = require('gulp-inject-svg'),
    runSequence = require('run-sequence');

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(sourcemaps.write('app/assets/css'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    .pipe(sourcemaps.init())
    //.pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));

  gulp.src('src/js/*.min.js')
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));

 gulp.src('node_modules/bootstrap-sass/assets/javascripts/bootstrap/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/assets/js/bootstrap'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
      .pipe(injectSvg())
      .pipe(htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        removeComments: true
      }))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({stream:true, once: true}));
});


gulp.task('sprites', function () {
  return sprity.src({
    src: './src/img/sprites/**/*.{png,jpg}',
    processor: 'sprity-sass',
    engine: 'sprity-gm',
    style: '_sprites.scss',
    prefix: 'bg',
    cssPath: '/assets/img',
    split: true,
    margin: 0,
    format: 'jpg',
    dimension: [
      {ratio: 1, dpi: 72},
      {ratio: 2, dpi: 192}
    ]
  })
  .pipe(gulpif('*.{png,jpg}', gulp.dest('app/assets/img'), gulp.dest('src/scss/base')))
  .pipe(browserSync.reload({stream:true, once: true}));
});


gulp.task('svg-min', function() {
  return gulp.src('src/img/svg/*.svg')
    .pipe(svgmin({
      plugins: [
        {removeTitle: true },
        {removeDesc: true },
        {removeDimensions: true}
      ]
    }))
    .pipe(gulp.dest('app/assets/img/svg'));
});

gulp.task('svg', function() {
  return runSequence('svg-min', 'html');
});

gulp.task('img-copy', function() {
  return gulp.src('src/img/full/*.{png,jpg}')
    .pipe(gulp.dest('app/assets/img/full/'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', function () {
    runSequence(['svg-min'], ['html', 'css', 'js', 'browser-sync']);
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("./src/img/sprites/**/*.{png,jpg}", ['sprites']);
    gulp.watch("./src/img/full/*.{png,jpg}", ['img-copy']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/*.html", ['html']);
    gulp.watch("src/img/svg/*.svg", ['svg']);

});
