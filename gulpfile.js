import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as defaultSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import rename from "gulp-rename";
import imagemin, { mozjpeg, optipng, svgo } from "gulp-imagemin";
import pug from "gulp-pug";
import data from "gulp-data";
import clean from "gulp-clean";
import mergeStreams from "merge-stream";
import fs from "fs";
import path from "path";
import browserSync from "browser-sync";
import glob from "glob";
import webpack from "webpack"
import webPackCfg from "./webpack.config.js";
import * as cheerio from "cheerio";
import webpackStream from "webpack-stream"
const bs = browserSync.create();
const sass = gulpSass(defaultSass);

gulp.task("inline-svg", (done) => {
  const distDir = "./dist";

  function insertSvgToHtmlFile(filePath) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const $ = cheerio.load(fileContents, {
      xmlMode: false,
      selfClosingTags: false,
    });

    $(".inline-svg").each((i, el) => {
      const src = $(el).attr("src");
      const savedClass = $(el).attr("class");
      if (src) {
        const svgFilePath = path.join(distDir, src);
        try {
          const svgContent = fs.readFileSync(svgFilePath, "utf8");
          const $svg = cheerio.load(svgContent, {
            xmlMode: false,
            selfClosingTags: false,
          });
          $svg("svg").addClass(savedClass);
          $(el).replaceWith($svg.html());
        } catch (error) {
          console.error(`Error reading SVG file: ${svgFilePath}`, error);
        }
      }
    });
    fs.writeFileSync(filePath, $.html(), "utf8");
  }

  const htmlFiles = glob.sync(`${distDir}/**/*.html`);

  htmlFiles.forEach((filePath) => {
    insertSvgToHtmlFile(filePath);
  });
  done();
});

gulp.task("styles", function () {
  return gulp
    .src("src/css/**/*.scss")
    .pipe(sass())
    .pipe(concat("all-styles.css"))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(cleanCSS())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(bs.stream());
});

gulp.task("pug", (done) => {
  const jsonDataFiles = fs
    .readdirSync("src/data")
    .filter((file) => path.extname(file) === ".json");
  let indexData = {};
  const tasks = jsonDataFiles.map((jsonFile) => {
    const jsonDataPath = path.join("src/data", jsonFile);
    const jsonData = fs.readFileSync(jsonDataPath);

    const isIndex = jsonFile === "index.json";
    const dataKey = isIndex ? "indexData" : "sliderData";
    if (isIndex) {
      indexData = JSON.parse(jsonData);
    }
    return gulp
      .src("src/templates/index.pug")
      .pipe(
        data(() => ({
          [dataKey]: isIndex
            ? JSON.parse(jsonData)
            : { ...JSON.parse(jsonData), experience: indexData.experience, noResponsive: indexData.noResponsive },
        })),
      )
      .pipe(pug())
      .pipe(rename(`${jsonFile.replace(".json", ".html")}`))
      .pipe(gulp.dest("dist"));
  });

  const mergedPugTasks = mergeStreams(tasks);

  mergedPugTasks.on("end", done);

  return mergedPugTasks;
});

gulp.task("optimizeImages", () => {
  return gulp
    .src("src/assets/images/**/*")
    .pipe(
      imagemin([
        mozjpeg({ quality: 85, progressive: true }),
        optipng({ optimizationLevel: 1 }),
        svgo(),
      ]),
    )
    .pipe(gulp.dest("dist/assets/images"));
});

gulp.task("fonts", () => {
  return gulp.src("src/assets/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("videos", () => {
  return gulp
    .src("src/assets/videos/**/*")
    .pipe(gulp.dest("dist/assets/videos"));
});

gulp.task('scripts', function () {
  return gulp
    .src('src/js/main.js')
    .pipe(webpackStream(webPackCfg, webpack))
    .pipe(gulp.dest('dist/js'))
    .pipe(bs.stream());
});

gulp.task("watch", function () {
  bs.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp
    .watch("src/css/**/*.scss")
    .on("change", gulp.series("styles", "pug", "inline-svg", bs.reload));
  gulp
    .watch("src/data/**/*.json")
    .on("change", gulp.series("pug", "inline-svg", bs.reload));
  gulp.watch("src/js/**/*.js").on("change", gulp.series("scripts", bs.reload));
  gulp
    .watch("src/templates/**/*.pug")
    .on("change", gulp.series("pug", "inline-svg", bs.reload));
});

gulp.task("clean", function () {
  if (fs.existsSync('./dist')) {
    return gulp.src("./dist", { read: false, allowEmpty: true })
      .pipe(clean({ force: true }));
  } else {
    console.log('The "dist" directory does not exist. Nothing to clean.');
    return Promise.resolve();
  }
});

  gulp.task(
    "prod",
    gulp.series(
      gulp.parallel(
        "fonts",
        "videos",
        "styles",
        "scripts",
        "optimizeImages",
        "pug",
      ),
      "inline-svg",
    ),
  );
  gulp.task(
    "dev",
    gulp.series(
      "clean",
      gulp.parallel(
        "fonts",
        "videos",
        "styles",
        "scripts",
        "optimizeImages",
        "pug",
      ),
      "inline-svg",
      "watch",
    ),
  );