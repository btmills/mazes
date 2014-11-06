var gulp       = require('gulp'),
    plumber    = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    to5        = require('gulp-6to5'),
    concat     = require('gulp-concat');

var paths = {
	src: ['src/**/!(app)*.js', 'src/app.js'],
	dest: 'js'
};

gulp.task('build', function () {
	gulp.src(paths.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(to5())
		.pipe(concat('index.js'))
		.pipe(sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: '..'
		}))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function () {
	gulp.watch(src, ['build']);
});

gulp.task('default', ['build', 'watch']);
