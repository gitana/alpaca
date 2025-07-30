const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css'); // Updated from deprecated gulp-minify-css
const paths = require('../utils/paths');

function buildWebStyles() {
    return src(paths.styles.web)
        .pipe(concat('alpaca.css'))
        .pipe(dest('build/alpaca/web'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(dest('build/alpaca/web'));
}

function copyWebImages() {
    return src("src/css/images/**")
        .pipe(dest('./build/alpaca/web/images'));
}

function buildBootstrapStyles() {
    return src(paths.styles.bootstrap)
        .pipe(concat('alpaca.css'))
        .pipe(dest('build/alpaca/bootstrap'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(dest('build/alpaca/bootstrap'));
}

function copyBootstrapImages() {
    return src("src/css/images/**")
        .pipe(dest('./build/alpaca/bootstrap/images'));
}

function buildJQueryUIStyles() {
    return src(paths.styles.jqueryui)
        .pipe(concat('alpaca.css'))
        .pipe(dest('build/alpaca/jqueryui'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(dest('build/alpaca/jqueryui'));
}

function copyJQueryUIImages() {
    return src("src/css/images/**")
        .pipe(dest('./build/alpaca/jqueryui/images'));
}

function buildJQueryMobileStyles() {
    return src(paths.styles.jquerymobile)
        .pipe(concat('alpaca.css'))
        .pipe(dest('build/alpaca/jquerymobile'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cleanCss())
        .pipe(dest('build/alpaca/jquerymobile'));
}

function copyJQueryMobileImages() {
    return src("src/css/images/**")
        .pipe(dest('./build/alpaca/jquerymobile/images'));
}

// Main styles task
const buildStyles = parallel(
    buildWebStyles,
    copyWebImages,
    buildBootstrapStyles,
    copyBootstrapImages,
    buildJQueryUIStyles,
    copyJQueryUIImages,
    buildJQueryMobileStyles,
    copyJQueryMobileImages
);

buildStyles.displayName = 'build-styles';
buildStyles.description = 'Build all CSS files and copy images';

module.exports = {
    buildStyles,
    buildWebStyles,
    buildBootstrapStyles,
    buildJQueryUIStyles,
    buildJQueryMobileStyles
};