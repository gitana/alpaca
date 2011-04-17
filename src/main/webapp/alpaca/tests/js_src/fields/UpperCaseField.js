(function($) {

    module("fields: uppercase");

    // Test case 1 : Upper case field.
    test("Upper case field.", function() {
        stop();
        $("#uppercase-1").alpaca({
            "data": "Ice cream is wonderful.",
            "schema": {
                "format": "uppercase"
            },
            "postRender": function (renderedField) {
                expect(4);
                equal(renderedField.getValue(), "ICE CREAM IS WONDERFUL.", 'Select field getValue() method returns correct value.');
                var inputElem = $('#uppercase-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "ICE CREAM IS WONDERFUL.", "Text input field value populated correctly.");
                inputElem.val('ice cream');
                inputElem.keypress(function() {
                    Alpaca.later(50, renderedField, function() {
                        equal(inputElem.val(), "ICE CREAM", "Text input converted to upper case automatically.");
                        start();
                    });
                });
                inputElem.keypress();
            }
        });
    });

}(jQuery) );