var pug = require("gulp-pug");
var sass = require("gulp-dart-sass");

var autoprefixer = require("gulp-autoprefixer");
var csso = require("gulp-csso");
var mmq = require("gulp-merge-media-queries");
var pxtorem = require("gulp-pxtorem");
var uncss = require("gulp-uncss");

var spritesmith = require("gulp.spritesmith");
var svgSprite = require("gulp-svg-sprite");

var imagemin = require("gulp-imagemin");
var imageminMozjpeg = require("imagemin-mozjpeg");
var pngquant = require("imagemin-pngquant");

var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");

var browserSync = require("browser-sync").create();
var buffer = require("vinyl-buffer");
// var cache = require('gulp-cached');
// var changed = require('gulp-changed');
var cheerio = require("gulp-cheerio");
var clean = require("gulp-clean");
var gulp = require("gulp");
var htmlhint = require("gulp-htmlhint");
var merge = require("merge-stream");
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var size = require("gulp-size");
var sourcemaps = require("gulp-sourcemaps");

// var pugInheritance = require('gulp-pug-inheritance');
var gulpif = require("gulp-if");
// var filter = require('gulp-filter');

var debug = require("gulp-debug");
var newer = require("gulp-newer");

const webp = require("gulp-webp");

//-- CLEAN ---------------------------------------------------------------------------------------------

gulp.task("clean", function () {
  return gulp.src("dist/*.*", { read: false, allowEmpty: true }).pipe(clean());
});

//-- JS ------------------------------------------------------------------------------------------------

// gulp.task('js', function () {
// 	return gulp.src("app/js/*.js")
// 		.pipe(jshint())
// 		.pipe(jshint.reporter('default'))
// 		.pipe(uglify())
// 		.pipe(concat('main.js'))
// 		.pipe(gulp.dest('dist/js'));
// });

gulp.task("js", () => {
  return gulp
    .src("app/js/*.js")
    .pipe(newer("dist/js"))
    .pipe(gulp.dest("dist/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("js:build", () => {
  return gulp
    .src("app/js/*.js")
    .pipe(newer("build/js"))
    .pipe(gulp.dest("build/js/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("libs-js:dev", () => {
  return gulp
    .src("app/libs/**")
    .pipe(gulp.dest("dist/libs/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("libs-js:build", () => {
  return gulp.src("app/libs/**").pipe(gulp.dest("build/libs/"));
});

//-- SASS -----------------------------------------------------------------------------------------------

gulp.task("sass:dev", function () {
  return gulp
    .src("app/sass/main.sass")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("sass:build", function () {
  return gulp
    .src("app/sass/main.sass")
    .pipe(sass())
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(rename({ suffix: ".min", prefix: "" }))

    .pipe(mmq({ log: true }))
    .pipe(csso())
    .pipe(size())
    .pipe(replace(".jpg", ".webp"))
    .pipe(replace(".png", ".webp"))
    .pipe(gulp.dest("build/css"));
});

//-- PUG -----------------------------------------------------------------------------------------------

gulp.task("pug:dev", function () {
  return (
    gulp
      .src(["app/pug/pages/**/*.pug"])
      // .pipe(cache('linting'))
      .pipe(pug({ pretty: true, basedir: __dirname + "/app/pug" }))
      // .pipe(replace('href="css/', 'href="css/'))
      .on("error", notify.onError("Error: <%= error.message %>"))
      .pipe(gulp.dest("dist"))
      .on("end", browserSync.reload)
  );
});

gulp.task("pug:build", function () {
  return (
    gulp
      .src([
        "app/pug/pages/**/*.pug",
        "!app/pug/pages/doc/**/*",
        "!app/pug/pages/temp/**/*",
      ])
      .pipe(pug({ pretty: true, basedir: __dirname + "/app/pug" }))
      // .pipe(replace('href="css/', 'href="css/'))
      .pipe(replace(".jpg", ".webp"))
      .pipe(replace(".png", ".webp"))
      .on("error", notify.onError("Error: <%= error.message %>"))
      .pipe(gulp.dest("build"))
  );
});

//-- Fonts ---------------------------------------------------------------------------------------------

gulp.task("fonts", () => {
  return gulp
    .src("app/fonts/**/*.*")
    .pipe(newer("dist/fonts"))
    .pipe(gulp.dest("dist/fonts/"));
});

gulp.task("fonts:build", () => {
  return gulp
    .src("app/fonts/**/*.*")
    .pipe(newer("build/fonts"))
    .pipe(gulp.dest("build/fonts/"));
});

//-- SVG SPRITE --------------------------------------------------------------------------------------

gulp.task("svg-sprite:dev", function () {
  return gulp
    .src([
      "app/img/icons/sprite/svg/symbol/flat/*.svg",
      "app/img/icons/sprite/svg/symbol/multi-layered/*.svg",
    ])
    .pipe(
      svgSprite({
        shape: {
          dimension: {
            maxWidth: 128,
            maxHeight: 128,
          },
        },
        mode: {
          symbol: {
            dest: ".",
            sprite: "sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(gulp.dest("dist/img/icons/sprite/svg/"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    )
    .on("end", browserSync.reload);
});

gulp.task("svg-sprite:build", function () {
  return gulp
    .src([
      "app/img/icons/sprite/svg/symbol/flat/*.svg",
      "app/img/icons/sprite/svg/symbol/multi-layered/*.svg",
    ])
    .pipe(
      svgSprite({
        shape: {
          dimension: {
            maxWidth: 128,
            maxHeight: 128,
          },
        },
        mode: {
          symbol: {
            dest: ".",
            sprite: "sprite.svg",
            example: false,
          },
        },
      })
    )
    .pipe(size())
    .pipe(gulp.dest("build/img/icons/sprite/svg/"));
});

gulp.task("cheerio", function () {
  return gulp
    .src("app/img/icons/sprite/svg/source/**/*.svg")
    .pipe(
      cheerio({
        run: function ($) {
          $("[fill]").removeAttr("fill");
          $("[stroke]").removeAttr("stroke");
          $("[style]").removeAttr("style");
          $("[class]").removeAttr("class");
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace("&gt;", ">"))
    .pipe(gulp.dest("app/img/icons/sprite/svg/symbol/flat"));
});

gulp.task("svg-clean", function () {
  return gulp
    .src("app/img/icons/sprite/svg/symbol/flat", {
      read: false,
      allowEmpty: true,
    })
    .pipe(clean());
});

//-- IMG -----------------------------------------------------------------------------------------------

gulp.task("img:dev", function () {
  return gulp
    .src(["app/img/**/*"])
    .pipe(newer("dist/img"))
    .pipe(gulp.dest("dist/img"));
});

gulp.task("img:build", function () {
  return gulp
    .src(["app/img/**/*", "!app/img/icons/sprite/**/*"])
    .pipe(webp())
    .pipe(newer("build/img"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("img-clean", function () {
  return gulp.src("dist/img/", { read: false }).pipe(clean());
});

//-- BROWSERSYNC -----------------------------------------------------------------------------------------

gulp.task("server", function () {
  browserSync.init({
    port: 3010,
    server: {
      baseDir: "dist",
    },
    notify: false,
    open: false,
  });
});

//-- WATCHS ----------------------------------------------------------------------------------------------

gulp.task("watch", function () {
  gulp.watch("app/**/*.sass", gulp.series(["sass:dev"]));
  gulp.watch(
    "app/img/icons/sprite/svg/source/**/*.svg",
    gulp.series(["cheerio"])
  );
  gulp.watch(
    "app/img/icons/sprite/svg/symbol/**/*.svg",
    gulp.series("svg-sprite:dev")
  );
  gulp.watch("app/js/*.js", gulp.series("js"));
  gulp.watch("app/pug/**/*.pug", gulp.series(["pug:dev"]));
  gulp.watch("app/fonts/**/*.*", gulp.series("fonts"));
  // gulp.watch('app/sass/templates/*', gulp.series('png-sprite'));
  gulp.watch(
    "app/img/**/*",
    gulp.series(["img-clean", "img:dev", "svg-sprite:dev"])
  );
});

//-- LAUNCH TASKS ----------------------------------------------------------------------------------------

gulp.task(
  "dev",
  gulp.series([
    "clean",
    "svg-clean",
    "cheerio",
    "svg-sprite:dev",
    "pug:dev",
    "sass:dev",
    "img:dev",
    gulp.parallel("js", "img:dev", "libs-js:dev", "fonts"),
  ])
);

gulp.task(
  "build",
  gulp.series([
    "clean",
    "svg-clean",
    "cheerio",
    "svg-sprite:build",
    "pug:build",
    "sass:build",
    gulp.parallel("img:build", "js:build", "libs-js:build", "fonts:build"),
  ])
);

gulp.task("default", gulp.series("dev", gulp.parallel("watch", "server", "fonts")));
