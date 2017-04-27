const gulp = require('gulp');
const browserify = require('gulp-browserify');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('bundle', function(){

	gulp.src('./public/App.jsx')
	.pipe(browserify())
	.on('error', (err)=>console.log(err))
	.pipe(babel({
		presets: ['react', 'es2016']
	}))
	.pipe(minify())
	.pipe(gulp.dest('./public/bundle'))

});

gulp.task('react', function(){
	gulp.src('./public/App.jsx')
	.pipe(sourcemaps.init())
	.pipe(babel({
        presets: [
			'react',
            'es2015'
            ]
        }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/react'));
})
