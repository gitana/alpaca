const { src, dest } = require('gulp');
const fs = require('fs');
const { exec } = require('child_process');
const pkg = require('../../package.json');

// Build Jekyll site
function buildSite(cb) {
    console.log("build-site start");

    const now = new Date();
    let datetime = "";
    datetime += (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear();

    // Write temp config file
    fs.writeFileSync("./_custom_config.yml", `alpaca_version: ${pkg.version}\r\nalpaca_date: ${datetime}`);

    const cmd = "jekyll build --config ./site/_config.yml,./_custom_config.yml -s ./site -d ./build/site --trace";
    exec(cmd, function(err, stdout, stderr) {
        console.log("jekyll completed");

        // Clean up temp file
        fs.unlinkSync("./_custom_config.yml");

        console.log("build-site complete");
        
        if (err) {
            console.error('Jekyll build error:', stderr);
            cb(err);
        } else {
            cb();
        }
    });
}

// Update site with full content
function updateSiteFull() {
    return src([
        "./build/site/**/*",
        "./build/lib/**/*",
        "./build/alpaca/**/*"
    ]).pipe(dest('./build/web'));
}

// Update site with only alpaca files
function updateSiteAlpaca() {
    return src([
        "./build/lib/**/*",
        "./build/alpaca/**/*"
    ]).pipe(dest('./build/web'));
}

buildSite.displayName = 'build-site';
buildSite.description = 'Build Jekyll site';

updateSiteFull.displayName = 'update-site-full';
updateSiteFull.description = 'Update site with full content';

updateSiteAlpaca.displayName = 'update-site-alpaca';
updateSiteAlpaca.description = 'Update site with only Alpaca files';

module.exports = {
    buildSite,
    updateSiteFull,
    updateSiteAlpaca
};