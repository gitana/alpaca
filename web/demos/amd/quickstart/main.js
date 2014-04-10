require.config({
    "baseUrl": "lib",
    "packages": [
        {
            "name": "jquery",
            "main": "../jquery-latest.min"
        },
        {
            "name": "handlebars",
            "main": "../handlebars"
        },
        {
            "name": "jquery-ui",
            "main": "../jquery-ui-latest/jquery-ui-latest.custom.min"
        },
        {
            "name": "alpaca",
            "main": "alpaca"
        },
        {
            "name": "form",
            "main": "../../form"
        }
    ],
    "shim": {
        "jquery-ui": ["jquery"],
        "jquery": []
    }
});

require(["form"], function() {

    // all done

});