'use strict';

module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['jasmine'],

        files: [
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/reflect-metadata/Reflect.js',

            { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/angular2-uuid/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false },

            { pattern: 'lib/ts/**/*.js', included: false, watched: true },
            { pattern: 'lib/templates/*.html', included: false, watched: true },
            { pattern: 'lib/test/**/*.spec.js', included: false, watched: true },

            'test-main.js'
        ],

        proxies: {
            '/templates/': '/base/templates/'
        },

        exclude: [
            'node_modules/@angular/**/*_spec.js'
        ],

        reporters: ['dots'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,
        autoWatch: true,

        browsers: [
            'Chrome'
        ],

        singleRun: false
    });
};
