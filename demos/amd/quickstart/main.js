require.config({
    "baseUrl": "lib",
    "packages": [
        {
            "name": "jquery",
            "main": "../jquery-latest.min"
        },
        {
            "name": "jquery-tmpl",
            "main": "../jquery.tmpl"
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
        "jquery-tmpl": ["jquery"],
        "jquery": []
    }
});

require(["form"], function() {

    // all done

});