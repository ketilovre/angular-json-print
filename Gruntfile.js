/* global module:false */

module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        karma: {
            unit: {
                options: {
                    basePath: '',
                    frameworks: ['jasmine'],
                    files: [
                        'lib/angular/angular.min.js',
                        'lib/angular-mocks/angular-mocks.js',
                        'src/json-print.js',
                        'test/JsonPrintSpec.js'
                    ],
                    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
                    reporters: ['progress', 'coverage'],
                    preprocessors: {
                        'src/json-print.js': 'coverage'
                    },
                    port: 9876,
                    colors: true,
                    autoWatch: false,
                    browsers: ['PhantomJS'],
                    captureTimeout: 60000,
                    singleRun: true,
                    plugins: [
                        'karma-jasmine',
                        'karma-coverage',
                        'karma-phantomjs-launcher'
                    ]
                }
            }
        }

    });

    grunt.registerTask('default', ['jshint', 'karma']);

};