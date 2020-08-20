const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const del = require('del');
const imageMin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const pathStyles = [
	'src/sass/reset.scss',
	'src/sass/header.scss',
	'src/sass/index.scss',
	'src/sass/cards.scss',
	'src/sass/sidebar.scss',
	'src/sass/invite.scss',
	'src/sass/roundHistory.scss',
	'src/sass/main.scss',
	'src/sass/media.scss'
]

const styles = () => {
	return gulp.src(pathStyles)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('style.css')) 
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
}

const pugs = () => {
	return gulp.src("src/pug/*.pug")
		.pipe(pug())
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
}

const images = () => {
	return gulp.src("src/img/**/*.png")
		.pipe(imageMin())
		.pipe(gulp.dest("./dist/img"));
}

const watch = () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
	gulp.watch('src/pug/**/*.pug', pugs);
	gulp.watch('src/sass/**/*.sass', styles);
	gulp.watch('src/sass/**/*.scss', styles);
	gulp.watch('src/*html').on('change', browserSync.reload);
}

const clean = () => {
	return del(['dist/*']);
}

gulp.task('js', () => browserify('./src/app.js', { debug: true })
    .transform(babelify, { 
        presets: ['@babel/preset-env'], 
        plugins: ['@babel/transform-runtime'], 
        sourceMaps: true
     })
    .bundle()
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(rename('index.min.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task('build', gulp.series(clean, gulp.parallel(pugs, styles, images)));
gulp.task('watch', gulp.series('build', watch));