(function($) {

    module("fields: email");

    // Test case 1 : Email field.
    test("Email field.", function() {
        stop();
        $("#email-1").alpaca({
            "data": "support",
            "schema": {
                "format": "email"
            },
            "postRender": function (renderedField) {
                expect(7);
                equal(renderedField.getValue(), "support", 'Email field getValue() method returns correct value.');
                var inputElem = $('#email-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "support", "Text input field value populated correctly.");
                var invalidElem = $('#email-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#email-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), renderedField.view.getMessage("invalidEmail"), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == 'admin@alpaca.org') {
                        var invalidElem = $('#email-1 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value 10/10/2001.');
                    }
                });
                inputElem.val('admin@alpaca.org');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery));
