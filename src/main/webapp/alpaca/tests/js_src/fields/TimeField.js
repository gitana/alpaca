(function($) {

    module("fields: time");

    // Test case 1 : Upper case field.
    test("Time field.", function() {
        stop();
        $("#time-1").alpaca({
            "data": "10:75:76",
            "schema": {
                "format": "time"
            },
            "postRender": function (renderedField) {
                expect(7);
                equal(renderedField.getValue(), "10:75:76", 'Time field getValue() method returns correct value.');
                var inputElem = $('#time-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "10:75:76", "Text input field value populated correctly.");
                var invalidElem = $('#time-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#time-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("invalidTime"), [renderedField.options.timeFormat]), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == '10:10:16') {
                        var invalidElem = $('#time-1 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value 10:10:16.');
                    }
                });
                inputElem.val('10:10:16');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery) );