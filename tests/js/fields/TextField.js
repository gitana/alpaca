(function($) {

    module("fields: text");

    // Test case 1 : Simple text field with only string data input.
    test("Simple text field with only string data input", function() {
        stop();
        $("#text-1").alpaca({
            "data": "I Love Alpaca Ice Cream!",
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#text-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), 'I Love Alpaca Ice Cream!', 'Input field value populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Text field with data, schema and options.
    test("Text field with data, schema and options", function() {
        stop();
        $("#text-2").alpaca({
            "data": "Mint Chocolate",
            "options": {
                "label": "Ice Cream",
                "helper": "Your favorite ice cream?",
                "placeholder": "Enter an Ice Cream flavor",
                "size": 30
            },
            "schema": {
                "minLength": 3,
                "maxLength": 8
            },
            "postRender": function (renderedField) {
                expect(11);
                var inputElem = $('#text-2 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), 'Mint Chocolate', 'Input field value populated correctly.');
                equal(inputElem.attr('size'), "30", 'Input field size set.');
                equal(inputElem.attr('placeholder'), "Enter an Ice Cream flavor", 'Input field placeholder set.');
                var labelElem = $('#text-2 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Input field label generated.');
                equal(labelElem.text(), 'Ice Cream', 'Label text populated correctly.');
                var helperElem = $('#text-2 .alpaca-controlfield-helper > span.alpaca-controlfield-helper-text');
                ok(helperElem.length, 'Input field helper generated.');
                equal(helperElem.text(), 'Your favorite ice cream?', 'Helper text populated correctly.');
                var invalidElem = $('#text-2 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#text-2 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringTooLong"), [8]), 'Error message text populated correctly.');
                start();
            }
        });
    });

    // Test case 3 : Text field with data, schema, options and custom view.
    test("Text field with data, schema, options and custom view", function() {
        stop();
        $("#text-3").alpaca({
            "data": "Mint",
            "options": {
                "label": "Ice Cream",
                "helper": "Your favorite ice cream?",
                "placeholder": "Enter an Ice Cream flavor",
                "size": 30
            },
            "schema": {
                "minLength": 3,
                "maxLength": 8
            },
            "view": {
                "parent": "VIEW_WEB_EDIT",
                "styles": {
                    ".alpaca-controlfield-label": {
                        "float": "left",
                        "padding": "6px 0.3em 0 0"
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(12);
                var inputElem = $('#text-3 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), 'Mint', 'Input field value populated correctly.');
                equal(inputElem.attr('size'), "30", 'Input field size set.');
                equal(inputElem.attr('placeholder'), "Enter an Ice Cream flavor", 'Input field placeholder set.');
                var labelElem = $('#text-3 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Input field label generated.');
                equal(labelElem.text(), 'Ice Cream', 'Label value populated correctly.');
                equal(labelElem.parent().css('float'), 'left', 'Label float style injected correctly.');
                equal(labelElem.parent().css('padding-top'), '6px', 'Label padding style injected correctly.');
                var helperElem = $('#text-3 .alpaca-controlfield-helper > span.alpaca-controlfield-helper-text');
                ok(helperElem.length, 'Input field helper generated.');
                equal(helperElem.text(), 'Your favorite ice cream?', 'Helper text populated correctly.');
                var invalidElem = $('#text-3 .alpaca-field-invalid');
                ok(invalidElem.length==0, 'Input field not marked as invalid.');
                var messageElem = $('#text-3 .alpaca-controlfield-message-text');
                ok(messageElem.length==0, 'Field error message not generated.');
                start();
            }
        });
    });

}(jQuery) );
