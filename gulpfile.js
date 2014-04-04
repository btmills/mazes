var gulp    = require('gulp');
var traceur = require('gulp-traceur');
var plumber = require('gulp-plumber');

var src = ['./src/*.js'];

gulp.task('build', function () {
	gulp.src(src)
		.pipe(plumber())
		.pipe(traceur())
		.pipe(gulp.dest('./js/'));
});

gulp.task('watch', function () {
	gulp.watch(src, ['build']);
});

gulp.task('default', ['build', 'watch']);
