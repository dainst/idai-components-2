var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var typescript = require('gulp-typescript');
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');
var webserver = require('gulp-webserver');

// compile sass and concatenate to single css file in build dir
gulp.task('convert-sass', function() {

	return gulp.src('src/scss/app.scss')
	  	.pipe(sass({includePaths: [
			'node_modules/bootstrap/scss/',
			'node_modules/mdi/scss/'
		], precision: 8}))
	  	.pipe(concat(pkg.name + '.css'))
	    .pipe(gulp.dest('src/css'));
});

function watch() {
    gulp.watch('src/scss/**/*.scss', ['convert-sass']);
}

gulp.task('webserver-watch', function() {
	gulp.src('./') 
        .pipe(webserver({
			fallback: 'index.html',
			port: 8083
		}));
	watch();
});


const tscConfig = require('./tsconfig.json');
gulp.task('compile',['convert-sass'], function () {
    // fonts
    gulp.src([
            'node_modules/mdi/fonts/**/*',
            'node_modules/bootstrap-sass/assets/fonts/**/*'
        ])
        .pipe(gulp.dest('fonts'));
	
    // sources
    gulp
        .src('*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('./'));
    
    gulp
		.src('demo/app/**/*.ts')
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(gulp.dest('demo/app/'));

    gulp
        .src('src/app/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('src/app/'));

	// test sources
    return gulp
		.src('src/test/**/*.ts')
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(gulp.dest('src/test/'));
});


