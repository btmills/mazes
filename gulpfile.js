/* eslint-env node */
'use strict';

var babelify     = require('babelify'),
	browserify   = require('browserify'),
	buffer       = require('vinyl-buffer'),
	del          = require('del'),
	gulp         = require('gulp'),
	gutil        = require('gulp-util'),
	path         = require('path'),
	plumber      = require('gulp-plumber'),
	source       = require('vinyl-source-stream'),
	sourcemaps   = require('gulp-sourcemaps')/*,
	uglify       = require('gulp-uglify')*/;

var paths = {
	dest: './js',
	js: {
		src: './src/**/*.js',
		main: './src/app.js',
		dest: './js',
		maps: '/jsx'
	}
};

function handleError(err) {
	gutil.log(err.toString());
	this.emit('end');
}

gulp.task('clean', function () {
	return del(paths.dest, { force: true });
});

gulp.task('js', function () {
	return browserify(paths.js.main, { debug: true })
		.transform(babelify)
		.bundle()
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(source(path.basename(paths.js.main)))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		//.pipe(uglify())
		.pipe(sourcemaps.write({ sourceRoot: paths.js.maps }))
		.pipe(gulp.dest(paths.js.dest));
});

gulp.task('default', ['js']);

gulp.task('watch', ['default'], function () {
	gulp.watch(paths.js.src, ['js']);
});
