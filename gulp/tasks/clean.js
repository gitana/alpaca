const { src } = require('gulp');
const clean = require('gulp-clean');

function cleanTask() {
    return src(["build", "dist"], { read: false, allowEmpty: true })
        .pipe(clean());
}

cleanTask.displayName = 'clean';
cleanTask.description = 'Clean build and dist directories';

module.exports = cleanTask;