const { watch: gulpWatch, series } = require('gulp');
const nodemon = require('gulp-nodemon');
const paths = require('../utils/paths');

// Import tasks we need to reference
const { buildTemplates } = require('./templates');
const { buildScripts } = require('./scripts');
const { buildStyles } = require('./styles');
const { buildSite, updateSiteFull, updateSiteAlpaca } = require('./site');

// Watch task
function watch(cb) {
    // Scripts
    gulpWatch(paths.scripts.core, series(buildTemplates, buildScripts, updateSiteAlpaca));

    // All views
    gulpWatch(paths.scripts.all_views, series(buildTemplates, buildScripts, updateSiteAlpaca));

    // Templates
    gulpWatch(paths.templates.all, series(buildTemplates, buildScripts, updateSiteAlpaca));

    // Styles
    gulpWatch(paths.styles.all, series(buildStyles, updateSiteAlpaca));

    // Web
    gulpWatch(["site/*/**", "site/*", "site/*.*"], series(buildSite, updateSiteFull));

    cb();
}

// Server task
function server(cb) {
    nodemon({
        script: 'server/webserver.js',
        ignore: [
            "./**",
            "*/**",
            "*",
            "*.*"
        ],
        watch: "aaaaa/**"
    });
    cb();
}

// Test server task
function testsite(cb) {
    nodemon({
        script: 'server/webserver.js',
        ignore: [
            "./**",
            "*/**",
            "*",
            "*.*"
        ],
        watch: "aaaaa/**",
        env: { 'NODE_ENV': 'test' }
    });
    cb();
}

watch.displayName = 'watch';
watch.description = 'Watch files for changes';

server.displayName = 'server';
server.description = 'Start development server';

testsite.displayName = 'testsite';
testsite.description = 'Start test server';

module.exports = {
    watch,
    server,
    testsite
};