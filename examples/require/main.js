require.config({
    "baseUrl": "lib",
    "packages": [
        {
            "name": "jquery",
            "main": "jquery"
        },
        {
            "name": "alpaca",
            "main": "alpaca"
        }
    ]
});

require(["alpaca"], function()
{

    $("#field1").alpaca({
        "data": "I Love Alpaca Ice Cream!"
    });

    $("#field2").alpaca({
        "data": "Mint Chocolate",
        "options": {
            "label": "Ice Cream",
            "helper": "Your favorite ice cream?",
            "size": 30
        },
        "schema": {
            "minLength": 3,
            "maxLength": 8
        }
    });

    $("#field3").alpaca({
        "data": "Mint",
        "options": {
            "label": "Ice Cream",
            "helper": "Your favorite ice cream?",
            "size": 30
        },
        "schema": {
            "minLength": 3,
            "maxLength": 8
        },
        "view": {
            "parent": "VIEW_WEB_EDIT",
            "styles": {
                ".alpaca-controlfield-label": {
                    "float": "left",
                    "padding": "6px 0.3em 0 0"
                }
            }
        }
    });

    $("#field4").alpaca({
        "data": "123-45-6789",
        "options": {
            "label": "Social Security Number",
            "helper": "Please enter your social security number.",
            "size": 30,
            "maskString": "999-99-9999"
        }
    });

});
