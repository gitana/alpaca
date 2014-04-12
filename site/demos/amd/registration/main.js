require.config({
    "packages": [
        {
            "name": "jquery",
            "location": "/lib/jquery-2.1.0",
            "main": "jquery-2.1.0.min"
        },
        {
            "name": "handlebars",
            "location": "/lib/handlebars",
            "main": "handlebars-v1.3.0"
        },
        {
            "name": "jquery-ui",
            "location": "/lib/jquery-ui/js",
            "main": "jquery-ui-1.10.4.custom.min"
        },
        {
            "name": "alpaca",
            "location": "/lib/alpaca/jqueryui",
            "main": "alpaca"
        },
        {
            "name": "registration",
            "main": "../registration"
        }
    ],
    "shim": {
        "jquery-ui": ["jquery"],
        "jquery": [],
        "handlebars": {
            "exports": "Handlebars"
        }
    }
});

require(["registration"], function() {

    // all done

});