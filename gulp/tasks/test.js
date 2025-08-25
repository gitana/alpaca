const { src, watch: gulpWatch } = require('gulp');
const jshint = require('gulp-jshint');
const { exec } = require('child_process');
const through2 = require('through2');

// Lint task
function lint() {
    return src("./src/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
}

// Watch lint task
function watchLint(cb) {
    gulpWatch("./src/js/**/*.js", lint);
    cb();
}

// Cucumber test task
function cucumber(cb) {
    console.log("Running Cucumber tests...");

    const cmd = "node_modules/.bin/cucumber-js tests/cucumber/features -f json";
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error('Cucumber tests failed:', stderr);
            // Create error report
            const report = JSON.parse(stdout || '[]');
            
            report.forEach(function(feature) {
                feature.elements.forEach(function(element) {
                    let failed = false;
                    element.steps.forEach(function(step) {
                        if (step.result.status === "failed") {
                            failed = true;
                        }
                    });
                    if (failed) {
                        console.log("FAIL: " + feature.name + " | " + element.name);
                    }
                });
            });
            
            cb(err);
        } else {
            console.log("Cucumber tests passed!");
            cb();
        }
    });
}

lint.displayName = 'lint';
lint.description = 'Run JSHint on source files';

watchLint.displayName = 'watch:lint';
watchLint.description = 'Watch and lint files';

cucumber.displayName = 'cucumber';
cucumber.description = 'Run Cucumber tests';

module.exports = {
    lint,
    watchLint,
    cucumber
};