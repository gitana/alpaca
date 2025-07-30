const { series, parallel } = require('gulp');

// Import tasks
const clean = require('./gulp/tasks/clean');
const { buildTemplates } = require('./gulp/tasks/templates');
const { buildScripts } = require('./gulp/tasks/scripts');
const { buildStyles } = require('./gulp/tasks/styles');
const { 
    packageTask, 
    bumpVersion, 
    bumpMinorVersion, 
    bumpMajorVersion,
    updateReleaseTxt 
} = require('./gulp/tasks/version');

// Import all tasks
const { buildSite, updateSiteFull, updateSiteAlpaca } = require('./gulp/tasks/site');
const { server, watch, testsite } = require('./gulp/tasks/server');
const { lint, watchLint, cucumber } = require('./gulp/tasks/test');
const { cdn, website, npmpackage } = require('./gulp/tasks/deploy');

// Register individual tasks
exports.clean = clean;
exports.buildTemplates = buildTemplates;
exports.buildScripts = buildScripts;
exports.buildStyles = buildStyles;
exports.package = packageTask;
exports.bump = bumpVersion;
exports.bumpMinor = bumpMinorVersion;
exports.bumpMajor = bumpMajorVersion;

// Build task
const build = series(
    clean,
    parallel(buildTemplates, buildScripts, buildStyles)
);

// Default task
exports.default = build;
exports.build = build;

// Distribution task
exports.dist = series(
    build,
    updateReleaseTxt,
    packageTask
);

// Publish task
exports.publish = series(
    exports.dist,
    cdn
);

// Site tasks
exports['build-site'] = buildSite;
exports['update-site-full'] = updateSiteFull;
exports['update-site-alpaca'] = updateSiteAlpaca;
exports.site = series(
    buildSite,
    updateSiteFull
);

// Server tasks
exports.server = series(watch, server);
exports.watch = watch;
exports.testsite = series(watch, testsite);

// Test tasks
exports.lint = lint;
exports['watch:lint'] = series(lint, watchLint);
exports.cucumber = cucumber;
exports.test = series(lint, cucumber);

// Deploy tasks
exports.cdn = cdn;
exports.website = website;
exports.npmpackage = npmpackage;

// Web task (builds for web distribution)
exports.web = series(
    build,
    buildSite,
    updateSiteFull
);