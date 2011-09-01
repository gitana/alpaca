(function($) {

    module("fields: lowercase");

    // Test case 1 : Lower case field.
    test("Lower case field.", function() {
        stop();
        $("#lowercase-1").alpaca({
            "data": "Ice Cream Is Wonderful.",
            "schema": {
                "format": "lowercase"
            },
            "postRender": function (renderedField) {
                expect(4);
                equal(renderedField.getValue(), "ice cream is wonderful.", 'Select field getValue() method returns correct value.');
                var inputElem = $('#lowercase-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "ice cream is wonderful.", "Text input field value populated correctly.");
                inputElem.val('ICE CREAM');
                inputElem.keypress(function() {
                    Alpaca.later(50, renderedField, function() {
                        equal(inputElem.val(), "ice cream", "Text input converted to lower case automatically.");
                        start();
                    });
                });
                inputElem.keypress();
            }
        });
    });

}(jQuery) );