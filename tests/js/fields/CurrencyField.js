(function($) {

    module("fields: currency");

    test("Currency field without unmasking", function() {
        stop();
        $("#currency-1").alpaca({
            "data": "1000000.00",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "unmask": false
            },
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#currency-1 input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(renderedField.getValue(), '$1,000,000.00', 'getValue() properly does not unmask input.');
                start();
            }
        });
    });

    test("Currency field with unmasking", function() {
        stop();
        $("#currency-2").alpaca({
            "data": "1000000.00",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "unmask": true
            },
            "postRender": function (renderedField) {
                expect(3);
                var inputElem = $('#currency-2 input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(inputElem.val(), '$1,000,000.00', 'Input field formats properly.');
                strictEqual(renderedField.getValue(), 1000000.00, 'getValue() properly unmasks input.');
                start();
            }
        });
    });

}(jQuery));
