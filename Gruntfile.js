/* global module:false */

module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');

    grunt.initConfig({

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },

        uglify: {
            target: {
                files: {
                    'json-print.min.js': ['src/json-print.js']
                }
            }
        },

        coveralls: {
            options: {
                coverage_dir: 'coverage',
                dryRun: false,
                force: true,
                recursive: true
            }
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
                    reporters: ['dots', 'coverage'],
                    preprocessors: {
                        'src/json-print.js': 'coverage'
                    },
                    coverageReporter: {
                        type: "lcov",
                        dir: "coverage"
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