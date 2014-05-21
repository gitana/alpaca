(function($) {

    module("fields: any", {
        "setup": function() {
            $("#qunit-fixture").append('<div id="any-fixture"></div>');
        },
        "teardown": function() {
            $("#any-fixture").remove();
        }
    });

    // Test case 1 : Any field with data and schema.
    test("Any field with data and schema", function() {
        stop();
        $("#any-fixture").alpaca({
            "view": "bootstrap-edit",
            "data": "I Love Alpaca Ice Cream!",
            "schema": {
                "title": "Ice Cream",
                "type": "any"
            },
            "postRender": function (renderedField) {
                expect(4);
                var inputElem = $('#any-fixture input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), 'I Love Alpaca Ice Cream!', 'Input field value populated correctly.');
                var labelElem = $('#any-fixture .alpaca-control-label');
                ok(labelElem.length, 'Input field label generated.');
                equal(labelElem.text(), 'Ice Cream', 'Label text populated correctly.');
                start();
            }
        });
    });

}(jQuery) );
