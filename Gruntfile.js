/**
 * NOTE: Alpaca uses Gulp for it's build process.  Please take a look at the README.md file for instructions.
 *
 * This Grunt file provides official Alpaca version release and deployment assistance to the deploy.sh bash file.
 * It isn't needed for local Alpaca builds and should only be used by the Alpaca release manager.
 */
module.exports = function(grunt) {

    var fs = require("fs");
    var path = require("path");

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('publish', ['aws_s3:clean', 'aws_s3:publish', 'invalidate_cloudfront:production']);

    var pkg = grunt.file.readJSON('package.json');
    var awsConfig = grunt.file.readJSON("../settings/__aws.json");

    var name = "alpaca";

    // config
    grunt.initConfig({

        "jsdoc": {
            "dist": {
                "src": [
                    "src/js/**/*.js",
                    "README.md"
                ],
                "options": {
                    "destination": "./build/alpaca/jsdoc",
                    "template": "node_modules/ink-docstrap/template",
                    "configure": "jsdoc.conf.json"
                }
            }
        },

        "aws_s3": {
            "options": {
                "accessKeyId": awsConfig.key,
                "secretAccessKey": awsConfig.secret,
                "region": awsConfig.region,
                "uploadConcurrency": 5,
                "downloadConcurrency": 5
            },
            "clean": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "dest": path.join(name, pkg.version),
                    "action": "delete"
                }]
            },
            "publish": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "expand": true,
                    "cwd": "dist/" + name,
                    "src": ['**/*'],
                    "dest": path.join(name, pkg.version)
                }]
            }
        },

        "invalidate_cloudfront": {
            "options": {
                "key": awsConfig.key,
                "secret": awsConfig.secret,
                "distribution": awsConfig.cloudfrontDistributionIds[name]
            },
            "production": {
                "files": [{
                    "expand": true,
                    "cwd": "dist/" + name,
                    "src": ["**/*"],
                    "filter": "isFile",
                    "dest": path.join(name, pkg.version)
                }]
            }
        }

    });
};