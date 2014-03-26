(function($) {

    module("fields: currency");

    test("Currency field unmasking", function() {
        stop();
        $("#currency-1").alpaca({
            "data": "1000000",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "unmask": true
            }
            "postRender": function (renderedField) {
                expect(3);
                var inputElem = $('#checkbox-1 input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(inputElem.val(), '$1,000,000.00', 'Input field formats properly.');
                strictEqual(renderedField.getValue(), 1000000, 'getValue() properly unmasks input.');
                start();
            }
        });
    });

}(jQuery));
