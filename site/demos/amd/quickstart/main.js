require.config({
    "packages": [
        {
            "name": "jquery",
            "location": "../../../lib/jquery/dist",
            "main": "jquery.min"
        },
        {
            "name": "handlebars",
            "location": "../../../lib/handlebars",
            "main": "handlebars"
        },
        {
            "name": "bootstrap",
            "location": "../../../lib/bootstrap/dist/js",
            "main": "bootstrap"
        },
        {
            "name": "alpaca",
            "location": "../../../lib/alpaca/bootstrap",
            "main": "alpaca"
        },
        {
            "name": "form",
            "main": "../form"
        }
    ],
    "shim": {
        "bootstrap": ["jquery"],
        "jquery": [],
        "handlebars": {
            "exports": "Handlebars"
        }
    }
});

require(["form"], function() {
    // all done
});
