(function($) {

    module("fields: number");

    // Test case 1 : Simple number field with only boolean data input.
    test("Simple number field with only number data input", function() {
        stop();
        $("#number-1").alpaca({
            "data": 15,
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#number-1 input:text');
                ok(inputElem.length, 'Input field generated.');
                equal(inputElem.val(), "15", 'Field value populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Number field with options and schema.
    test("Number field with label and right label", function() {
        stop();
        $("#number-2").alpaca({
            "data": 3.55,
            "options": {
                "label": "Gas Price:",
                "helper": "Enter Gas Price in Your Neighborhood"
            },
            "schema": {
                minimum: 2.10,
                maximum: 3.25
            }
            ,
            "postRender": function (renderedField) {
                expect(13);
                var inputElem = $('#number-2 input:text');
                ok(inputElem.length, 'Input field generated.');
                equal(inputElem.val(), "3.55", 'Field value populated correctly.');
                var labelElem = $('#number-2 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Field label generated.');
                equal(labelElem.text(), 'Gas Price:', 'Label text populated correctly.');
                var helperElem = $('#number-2 .alpaca-controlfield-helper > span.alpaca-controlfield-helper-text');
                ok(helperElem.length, 'Input field helper generated.');
                equal(helperElem.text(), 'Enter Gas Price in Your Neighborhood', 'Helper text populated correctly.');
                var invalidElem = $('#number-2 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#number-2 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringValueTooLarge"), [3.25]), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == '1.11') {
                        var invalidElem = $('#number-2 .alpaca-field-invalid');
                        ok(invalidElem.length, 'Input field marked as invalid with value 1.11.');
                        var messageElem = $('#number-2 .alpaca-controlfield-message-text');
                        ok(messageElem.length, 'Field error message generated.');
                        equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringValueTooSmall"), [2.1]), 'Error message text populated correctly.');
                                    }
                    if (inputElem.val() == '2.22') {
                        var invalidElem = $('#number-2 .alpaca-field-invalid');
                        ok(invalidElem.length==0, 'Input field marked as valid with value 2.22.');
                    }
                })
                inputElem.val('1.11');
                inputElem.blur();
                inputElem.val('2.22');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery) );
