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
            "name": "registration",
            "main": "../registration"
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

require(["registration"], function() {
    // all done
});
