(function($) {

    module("fields: any");

    // Test case 1 : Any field with data and schema.
    test("Any field with data and schema", function() {
        stop();
        $("#any-1").alpaca({
            "data": "I Love Alpaca Ice Cream!",
            "schema": {
                "title": "Ice Cream",
                "type": "any"
            },
            "postRender": function (renderedField) {
                expect(4);
                var inputElem = $('#any-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), 'I Love Alpaca Ice Cream!', 'Input field value populated correctly.');
                var labelElem = $('#any-1 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Input field label generated.');
                equal(labelElem.text(), 'Ice Cream', 'Label text populated correctly.');
                start();
            }
        });
    });

}(jQuery) );
