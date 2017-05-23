var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');
var webserver = require('gulp-webserver');

// compile sass and concatenate to single css file in build dir
gulp.task('convert-sass', function () {

    return gulp.src([
        'src/scss/idai-components-2.scss',
        'node_modules/leaflet/dist/leaflet.css'
    ])
        .pipe(sass({
            includePaths: [
                'node_modules/bootstrap/scss',
                'node_modules/mdi/scss/'
            ], precision: 8
        }))
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest('src/css'));
});

function watch() {
    gulp.watch('src/scss/**/*.scss', ['convert-sass']);
}

gulp.task('webserver-watch', function () {
    gulp.src('./')
        .pipe(webserver({
            fallback: 'index.html',
            port: 8083
        }));
    watch();
});

const tscConfig = require('./tsconfig.json');
gulp.task('compile', ['convert-sass'], function () {
    // fonts
    gulp.src([
        'node_modules/mdi/fonts/**/*'
    ])
        .pipe(gulp.dest('src/fonts'));

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
        .src('test/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('test/'));
});

function createConfig(path) {
    fs.access(path, fs.F_OK, function (err) {

        if (err) {
            fs.createReadStream(path + '.template').pipe(fs.createWriteStream(path));
        } else {
            console.log('Will not create ' + path + ' from template because file already exists.');
        }
    });
}

// Creates config file if it doesn't exist already
gulp.task('create-configs', function (callback) {
    createConfig('./demo/config/Configuration.json');
});
