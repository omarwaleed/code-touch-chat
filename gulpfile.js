const gulp = require('gulp');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const minify = require('gulp-minify');

gulp.task('bundle', function(){

	gulp.src('./public/App.jsx')
	.pipe(browserify())
	.pipe(babel({
		presets: ['react', 'es2016']
	}))
	.pipe(minify())
	.pipe(gulp.dest('./public/bundle'))

});
