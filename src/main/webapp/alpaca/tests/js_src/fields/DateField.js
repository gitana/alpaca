(function($) {

    module("fields: date");

    // Test case 1 : Upper case field.
    test("Date field.", function() {
        stop();
        $("#date-1").alpaca({
            "data": "10/105/2001",
            "schema": {
                "format": "date"
            },
            "postRender": function (renderedField) {
                expect(7);
                equal(renderedField.getValue(), "10/105/2001", 'Date field getValue() method returns correct value.');
                var inputElem = $('#date-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "10/105/2001", "Text input field value populated correctly.");
                var invalidElem = $('#date-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#date-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("invalidDate"), [renderedField.options.dateFormat]), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == '10/10/2001') {
                        var invalidElem = $('#date-1 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value 10/10/2001.');
                    }
                });
                inputElem.val('10/10/2001');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery) );