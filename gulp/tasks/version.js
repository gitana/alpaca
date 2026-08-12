const { src, dest } = require('gulp');
const fs = require('fs');
const bump = require('gulp-bump');
const gulpTemplate = require('gulp-template');
const rename = require('gulp-rename');
const config = require('../config');

function packageTask(cb) {
    fs.writeFileSync("./build/version.properties", "version=" + config.package.version);
    cb();
}

function bumpVersion() {
    return src(config.versionableFiles)
        .pipe(bump())
        .pipe(dest("./"));
}

function bumpMinorVersion() {
    return src(config.versionableFiles)
        .pipe(bump({ type: "minor" }))
        .pipe(dest("./"));
}

function bumpMajorVersion() {
    return src(config.versionableFiles)
        .pipe(bump({ type: "major" }))
        .pipe(dest("./"));
}

function updateReleaseTxt() {
    if (fs.existsSync("license.txt")) {
        fs.unlinkSync("license.txt");
    }

    return src("license.txt.template", { cwd: "./config" })
        .pipe(gulpTemplate({
            version: config.package.version
        }))
        .pipe(rename("license.txt"))
        .pipe(dest("."));
}

// Set display names
packageTask.displayName = 'package';
packageTask.description = 'Write version properties file';

bumpVersion.displayName = 'bump';
bumpVersion.description = 'Bump patch version';

bumpMinorVersion.displayName = 'bumpMinor';
bumpMinorVersion.description = 'Bump minor version';

bumpMajorVersion.displayName = 'bumpMajor';
bumpMajorVersion.description = 'Bump major version';

updateReleaseTxt.displayName = 'update-release-txt';
updateReleaseTxt.description = 'Update license.txt with current version';

module.exports = {
    packageTask,
    bumpVersion,
    bumpMinorVersion,
    bumpMajorVersion,
    updateReleaseTxt
};