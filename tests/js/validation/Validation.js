(function($) {

    module("validation: validation");

    // Test case 1 : Required field.
    test("Required field.", function() {
        stop();
        $("#validation-1").alpaca({
            "data": "",
            "schema": {
                "title": "Required field",
                "type": "string",
                "required": true
            },
            "postRender": function (renderedField) {
                expect(5);
                var inputElem = $('#validation-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                var invalidElem = $('#validation-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#validation-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), renderedField.view.getMessage("notOptional"), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == 'test') {
                        var invalidElem = $('#validation-1 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value test.');
                    }
                });
                inputElem.val('test');
                inputElem.blur();
                inputElem.focus();

                start();
            }
        });
    });

    // Test case 2 : Field with disallowed values.
    test("Field with disallowed values.", function() {
        stop();
        $("#validation-2").alpaca({
            "data": "book",
            "schema": {
                "title": "Diallowed value",
                "type": "string",
                "disallow": ["book", "pencil"]
            },
            "postRender": function (renderedField) {
                expect(5);
                var inputElem = $('#validation-2 input:text');
                ok(inputElem.length, 'Text input field generated.');
                var invalidElem = $('#validation-2 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#validation-2 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("disallowValue"), ['book,pencil']), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == 'book2') {
                        var invalidElem = $('#validation-1 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value book2.');
                    }
                });
                inputElem.val('book2');
                inputElem.blur();
                inputElem.focus();

                start();
            }
        });
    });

    // Test case 3 : JSON schema validator.
    test("JSON schema validator.", function() {
        expect(2);
        var data1 = "book";
        var data2 = "book2";
        var schema = {
            "title": "Enum field",
            "type": "string",
            "enum": ["book", "pen", "eraser"]
        };
        ok(Validator.validate(data1, schema).valid, 'Data1 is valid against the schema.');
        ok(!Validator.validate(data2, schema).valid, 'Data2 is invalid against the schema.');
    });

    // Test case 4 : Custom validator.
    test("Custom validator.", function() {
        stop();
        $("#validation-4").alpaca({
            "data": "book",
            "schema": {
                "title": "Diallowed value",
                "type": "string",
                "disallow": ["book", "pencil"]
            },
            "options": {
                "validator" : function(control, callback) {
                    var controlVal = control.getValue();
                    if (controlVal == "pen" || controlVal == "book") {
                        callback({
                            "message": "Invalid value (custom validator)",
                            "status": false
                        });
                    } else {
                        callback({
                            "message": "Valid value (custom validator)",
                            "status": true
                        });
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(9);
                var inputElem = $('#validation-4 input:text');
                ok(inputElem.length, 'Text input field generated.');
                var invalidElem = $('#validation-4 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#validation-4 .alpaca-controlfield-message-text:eq(1)');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), 'Invalid value (custom validator)', 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == 'pen') {
                        messageElem = $('#validation-4 .alpaca-controlfield-message-text:eq(0)');
                        ok(messageElem.length, 'Field error message generated.');
                        equal(messageElem.text(), 'Invalid value (custom validator)', 'Error message text populated correctly.');
                    }
                    if (inputElem.val() == 'pencil') {
                        messageElem = $('#validation-4 .alpaca-controlfield-message-text:eq(0)');
                        ok(messageElem.length, 'Field error message generated.');
                        equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("disallowValue"), ['book,pencil']), 'Error message text populated correctly.');
                    }
                    if (inputElem.val() == 'pen2') {
                        var invalidElem = $('#validation-4 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value book2.');
                    }
                });
                inputElem.val('pen2');
                inputElem.blur();
                inputElem.val('pen');
                inputElem.blur();
                inputElem.val('pencil');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery) );
