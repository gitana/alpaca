const { src } = require('gulp');
const awspublish = require('gulp-awspublish');
const pkg = require('../../package.json');

// CDN deployment task
function cdn() {
    console.log("Publishing to CDN (alpaca " + pkg.version + ")");

    // Create publisher
    const publisher = awspublish.create({
        region: 'us-east-1',
        params: {
            Bucket: 'code.cloudcms.com'
        }
    });

    // Define headers
    const headers = {
        'Cache-Control': 'max-age=600, no-transform, public'
    };

    return src([
        'dist/alpaca/**/*'
    ])
    .pipe(awspublish.gzip())
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
}

// Website deployment task
function website() {
    const publisher = awspublish.create({
        region: 'us-east-1',
        params: {
            Bucket: 'alpaca.cloudcms.com'
        }
    });

    const headers = {
        'Cache-Control': 'max-age=600, no-transform, public'
    };

    return src([
        'build/web/**/*'
    ])
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
}

// NPM package task (placeholder)
function npmpackage(cb) {
    console.log("NPM package task - not implemented");
    cb();
}

cdn.displayName = 'cdn';
cdn.description = 'Deploy to CDN';

website.displayName = 'website';
website.description = 'Deploy website';

npmpackage.displayName = 'npmpackage';
npmpackage.description = 'Create NPM package';

module.exports = {
    cdn,
    website,
    npmpackage
};