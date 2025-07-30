const pkg = require('../package.json');

module.exports = {
    package: pkg,
    versionableFiles: [
        "package.json",
        "alpaca.jquery.json",
        "bower.json"
    ],
    umdWrapperPath: "./config/umd-wrapper.txt"
};