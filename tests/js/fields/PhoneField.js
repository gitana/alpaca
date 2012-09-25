(function($) {

    module("fields: phone");

    // Test case 1 : Phone field.
    test("Phone field.", function() {
        stop();
        $("#phone-1").alpaca({
            "data": "",
            "schema": {
                "format": "phone"
            },
            "postRender": function (renderedField) {
                expect(6);
                var inputElem = $('#phone-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                inputElem.focus(function() {
                    equal(inputElem.val(), "(___) ___-____", "Text mask generated correctly.");
                    // change the field value and trigger the field re-validation
                    inputElem.blur(function() {
                        if (inputElem.val() == '') {
                            var invalidElem = $('#phone-1 .alpaca-field-invalid');
                            ok(invalidElem.length, 'Input field marked as invalid with value (123) 456-.');
                            var messageElem = $('#phone-1 .alpaca-controlfield-message-text');
                            ok(messageElem.length, 'Field error message generated.');
                            equal(messageElem.text(), renderedField.view.getMessage("invalidPhone"), 'Error message text populated correctly.');
                        }
                        if (inputElem.val() == '(123) 456-7890') {
                            var invalidElem = $('#phone-1 .alpaca-field-invalid');
                            ok(invalidElem.length == 0, 'Input field marked as valid with value (123) 456-7890.');
                        }
                    });
                    inputElem.val('(123) 456-');
                    inputElem.blur();
                    inputElem.val('(123) 456-7890');
                    inputElem.blur();
                });
                inputElem.focus();

                start();
            }
        });
    });

}(jQuery) );