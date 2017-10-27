'use strict';

module.exports = function(config) {
    config.set({

        basePath: '../../../',

        frameworks: ['jasmine'],

        files: [
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/systemjs/dist/system.src.js',
            { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/angular2-uuid/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/systemjs/dist/system-polyfills.js', included: false, watched: false },

            { pattern: 'src/ts/**/*.js', included: false, watched: true },
            { pattern: 'src/ts/**/*.html', included: false, watched: true },
            { pattern: 'test/browser/**/*.spec.js', included: false, watched: true },

            'test-main.js'
        ],

        proxies: {
            '/templates/': '/base/templates/'
        },

        exclude: [
            'node_modules/@angular/**/*_spec.js'
        ],

        reporters: ['dots'],

        port: 9878,

        colors: true,

        logLevel: config.LOG_INFO, // it must show WARN for them to be caught in ci. see build script.
        autoWatch: true,

        browsers: [
            'Chrome'
        ],

        singleRun: false
    });
};
