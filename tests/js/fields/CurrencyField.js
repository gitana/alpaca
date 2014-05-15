(function($) {

    module("fields: currency", {
        "setup": function() {
            $("#qunit-fixture").append('<div id="currency-fixture"></div>');
        },
        "teardown": function() {
            $("#currency-fixture").remove();
        }
    });

    test("Currency field without unmasking", function() {
        stop();
        $("#currency-fixture").alpaca({
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
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(renderedField.getValue(), '$1,000,000.00', 'getValue() properly does not unmask input.');
                start();
            }
        });
    });

    test("Currency field with unmasking", function() {
        stop();
        $("#currency-fixture").alpaca({
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
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(inputElem.val(), '$1,000,000.00', 'Input field formats properly.');
                strictEqual(renderedField.getValue(), 1000000.00, 'getValue() properly unmasks input.');
                start();
            }
        });
    });

    test("Currency field with rounding up", function() {
        stop();
        $("#currency-fixture").alpaca({
            "data": "4.05",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "round": "up"
            },
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(renderedField.getValue(), 5, 'getValue() rounds up correctly.');
                start();
            }
        });
    });

    test("Currency field with rounding down", function() {
        stop();
        $("#currency-fixture").alpaca({
            "data": "4.05",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "round": "down"
            },
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(renderedField.getValue(), 4, 'getValue() rounds down correctly.');
                start();
            }
        });
    });

    test("Currency field with rounding to the nearest", function() {
        stop();
        $("#currency-fixture").alpaca({
            "data": "4.05",
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "unmask": false,
                "round": "nearest"
            },
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(renderedField.getValue(), "$4.00", 'getValue() rounds to the nearest correctly.');
                start();
            }
        });
    });

    test("Currency field disallow negative", function() {
        stop();
        $("#currency-fixture").alpaca({
            "data": '-3.50',
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "allowNegative": false,
                "unmask": true
            },
            "postRender": function (renderedField) {
                expect(3);
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(inputElem.val(), '$3.50', 'Input field formats properly.');
                strictEqual(renderedField.getValue(), 3.50, 'getValue() returns a positive value');
                start();
            }
        });
    });

    test("Currency field properly parses numbers given as data", function() {
        stop();
        $("#currency-fixture").alpaca({
            "data": 3.50,
            "schema": {
                "title": "Cost",
                "type": "number"
            },
            "options": {
                "type": "currency",
                "allowNegative": false,
                "unmask": true
            },
            "postRender": function (renderedField) {
                expect(3);
                var inputElem = $('#currency-fixture input');
                ok(inputElem.length, 'Currency input field generated.');
                strictEqual(inputElem.val(), '$3.50', 'Input field formats properly.');
                strictEqual(renderedField.getValue(), 3.50, 'getValue() returns a positive value');
                start();
            }
        });
    });

}(jQuery));
