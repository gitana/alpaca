module.exports = function(grunt) {

    var WEB_SERVER_HOST = "localhost";
    var WEB_SERVER_PORT = 8000;
    var WEB_SERVER_BASE_PATH = "/apps/alpaca";

    var PROXY_HOST = "localhost";
    var PROXY_PORT = 8080;
    var PROXY_TIMEOUT = 5 * 60 * 1000;

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks("grunt-dustjs");

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('default', ['clean', 'copy', 'strip_markers', 'dustjs', 'requirejs', 'uglify']);
    grunt.registerTask('runtests', ['configureProxies:testing', 'connect:testing', 'qunit']);
    grunt.registerTask('web', ['configureProxies:standalone', 'connect:standalone']);

    grunt.registerMultiTask("strip_markers", "Strips code between markers from Alpaca source", function(target) {

        var options = this.options({
            start_marker: "//__BUILDER_HELPERS",
            end_marker: "//__END_OF_BUILDER_HELPERS"
        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            f.src.forEach(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return;
                }
                var contents = grunt.file.read(filepath);

                var x = contents.indexOf(options.start_marker);
                if (x > -1)
                {
                    var y = contents.indexOf(options.end_marker, x);
                    if (y > -1)
                    {
                        var replacement = contents.substring(0,x) + contents.substring(y + options.end_marker.length);
                        if (contents != replacement)
                        {
                            grunt.file.write(filepath, replacement);
                        }
                    }
                }
            });
        });
    });

    var filesetAlpacaCore = grunt.file.readJSON('./config/fileset-alpaca-core.json');
    var filesetAlpacaAll = grunt.file.readJSON('./config/fileset-alpaca-all.json');

    // fileset: core
    var filesetAlpacaCoreInclude = [];
    for (var i = 0; i < filesetAlpacaCore.length; i++)
    {
        filesetAlpacaCoreInclude.push(filesetAlpacaCore[i]);
    }

    // fileset: all
    var filesetAlpacaAllInclude = [];
    for (var i = 0; i < filesetAlpacaCore.length; i++)
    {
        filesetAlpacaAllInclude.push(filesetAlpacaCore[i]);
    }
    for (var i = 0; i < filesetAlpacaAll.length; i++)
    {
        filesetAlpacaAllInclude.push(filesetAlpacaAll[i]);
    }

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            all: {
                options: {
                    timeout: 120000, // let them timeouts run long (2 minutes)
                    urls: [
                        "http://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT + "/tests/index.html"
                    ]
                }
            }
        },

        connect: {
            standalone: {
                options: {
                    base: WEB_SERVER_BASE_PATH,
                    hostname: WEB_SERVER_HOST,
                    port: WEB_SERVER_PORT,
                    keepalive: true
                }
            }
        },

        clean: ["build", "dist"],

        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ["src/alpaca/**"],
                    dest: "build/"
                }]
            }
        },

        strip_markers: {
            options: {
                start_marker: '//__BUILDER_HELPERS',
                end_marker: '//__END_OF_BUILDER_HELPERS'
            },
            src: 'build/src/alpaca/fields/**/*.js'
        },

        dustjs: {
            compile: {
                files: {
                    "dist/templates/dust.bootstrap.js": ["build/src/alpaca/**/*.bootstrap.dust"],
                    "dist/templates/dust.jquerymobile.js": ["build/src/alpaca/**/*.jquerymobile.dust"],
                    "dist/templates/dust.jqueryui.js": ["build/src/alpaca/**/*.jqueryui.dust"]
                }
            }
        },

        requirejs: {
            core: {
                options: {
                    almond: true,
                    baseUrl: '.',
                    paths: {
                        alpaca: 'build/src/alpaca',
                        base: 'thirdparty/base/base',
                        jquery: "thirdparty/jquery/jquery-latest.min"
                    },
                    include: filesetAlpacaCoreInclude,
                    out: 'dist/alpaca-core.js',
                    wrap: {
                        startFile: 'wrap/wrap.start',
                        endFile: 'wrap/wrap.end'
                    }
                }
            },
            all: {
                options: {
                    almond: true,
                    baseUrl: '.',
                    paths: {
                        alpaca: 'build/src/alpaca',
                        base: 'thirdparty/base/base',
                        jquery: "thirdparty/jquery/jquery-latest.min"
                    },
                    include: filesetAlpacaAllInclude,
                    out: 'dist/alpaca-all.js',
                    wrap: {
                        startFile: 'wrap/wrap.start',
                        endFile: 'wrap/wrap.end'
                    }
                }
            }

        },

        uglify: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'build/src/alpaca',
                    src: '**/*.js',
                    dest: 'dist/alpaca'
                }]
            }
        }

    });
};