const path = require('path');

// Mozilla regex escape function
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Process template names for Handlebars
function processTemplateName(filepath) {
    // strip .js from end
    let i = filepath.indexOf(".js");
    if (i > -1) {
        filepath = filepath.substring(0, i);
    }

    // find "src/templates/" and index up
    let z = filepath.indexOf(path.join('src', 'templates', path.sep));
    filepath = filepath.substring(z + 14);

    // replace any "/" with .
    filepath = filepath.replace(new RegExp(escapeRegExp(path.sep), 'g'), ".");

    return filepath;
}

// Replace all occurrences of a token in text
function doReplace(text, token, value) {
    let i = -1;
    do {
        i = text.indexOf(token);
        if (i > -1) {
            text = text.replace(token, value);
        }
    }
    while (i > -1);

    return text;
}

module.exports = {
    escapeRegExp,
    processTemplateName,
    doReplace
};