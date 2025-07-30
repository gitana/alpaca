const { src, dest, parallel } = require('gulp');
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const paths = require('../utils/paths');
const { processTemplateName } = require('../utils/helpers');

function buildWebTemplates() {
    return src(paths.templates.web, { allowEmpty: true })
        .pipe(handlebars({ handlebars: require('handlebars') }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'HandlebarsPrecompiled',
            processName: processTemplateName,
            noRedeclare: true
        }))
        .pipe(concat('templates-web.js'))
        .pipe(dest('build/tmp/'));
}

function buildBootstrapTemplates() {
    return src(paths.templates.bootstrap, { allowEmpty: true })
        .pipe(handlebars({ handlebars: require('handlebars') }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'HandlebarsPrecompiled',
            processName: processTemplateName,
            noRedeclare: true
        }))
        .pipe(concat('templates-bootstrap.js'))
        .pipe(dest('build/tmp/'));
}

function buildJQueryUITemplates() {
    return src(paths.templates.jqueryui, { allowEmpty: true })
        .pipe(handlebars({ handlebars: require('handlebars') }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'HandlebarsPrecompiled',
            processName: processTemplateName,
            noRedeclare: true
        }))
        .pipe(concat('templates-jqueryui.js'))
        .pipe(dest('build/tmp/'));
}

function buildJQueryMobileTemplates() {
    return src(paths.templates.jquerymobile, { allowEmpty: true })
        .pipe(handlebars({ handlebars: require('handlebars') }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'HandlebarsPrecompiled',
            processName: processTemplateName,
            noRedeclare: true
        }))
        .pipe(concat('templates-jquerymobile.js'))
        .pipe(dest('build/tmp/'));
}

// Named exports for individual tasks
buildWebTemplates.displayName = 'build-templates:web';
buildBootstrapTemplates.displayName = 'build-templates:bootstrap';
buildJQueryUITemplates.displayName = 'build-templates:jqueryui';
buildJQueryMobileTemplates.displayName = 'build-templates:jquerymobile';

// Main templates task
const buildTemplates = parallel(
    buildWebTemplates,
    buildBootstrapTemplates,
    buildJQueryUITemplates,
    buildJQueryMobileTemplates
);
buildTemplates.displayName = 'build-templates';
buildTemplates.description = 'Compile all Handlebars templates';

module.exports = {
    buildTemplates,
    buildWebTemplates,
    buildBootstrapTemplates,
    buildJQueryUITemplates,
    buildJQueryMobileTemplates
};