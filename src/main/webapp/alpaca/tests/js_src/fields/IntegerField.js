(function($) {

    module("fields: integer");

    // Test case 1 : Simple object field with only integer data input.
    test("Simple object field with only integer data input.", function() {
        stop();
        $("#integer-1").alpaca({
            "data": 18,
            "postRender": function (renderedField) {
                expect(3);
                equal(renderedField.getValue(), 18, 'Integer field getValue() method returns correct value.')
                var inputElem0 = $('#integer-1 input:text');
                ok(inputElem0.length, 'Input field generated.');
                equal(inputElem0.val(), '18', 'Input field value populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Integer field with data and schema.
    test("Integer field with data and schema.", function() {
        stop();
        $("#integer-2").alpaca({
            "data": 17,
            "options": {
                "type": "integer",
                "label": "Age:",
                "helper": "Guess Talyor Swift's Age"
            },
            "schema": {
                minimum: 18,
                maximum: 25,
                exclusiveMinimum: true,
                exclusiveMaximum: true,
                divisibleBy: 2
            },
            "postRender": function (renderedField) {
                expect(17);
                var inputElem = $('#integer-2 input:text');
                ok(inputElem.length, 'Input field generated.');
                equal(inputElem.val(), '17', 'Input field value populated correctly.');
                var id = inputElem.attr('id');
                var inputElemLabelElem = $('#integer-2 #' + id + '-controlfield-label > div');
                ok(inputElemLabelElem.length, 'Input field label generated.');
                equal(inputElemLabelElem.text(), 'Age:', 'Input field label text populated correctly.');
                var inputElemHelperElem = $('#integer-2 #' + id + '-controlfield-helper .alpaca-controlfield-helper-text');
                ok(inputElemHelperElem.length, 'Input field helper generated.');
                equal(inputElemHelperElem.text(), "Guess Talyor Swift's Age", 'Input field helper text populated correctly.');
                var inputElem0MessageElem0 = $('#integer-2 #' + id + '-field-message-0 > .alpaca-controlfield-message-text');
                ok(inputElem0MessageElem0.length, 'First integer field invalid message generated.');
                equal(inputElem0MessageElem0.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringDivisibleBy"), [2]), 'First integer field invalid message text populated correctly.');
                var inputElem0MessageElem1 = $('#integer-2 #' + id + '-field-message-1 > .alpaca-controlfield-message-text');
                ok(inputElem0MessageElem1.length, 'Second integer field invalid message generated.');
                equal(inputElem0MessageElem1.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringValueTooSmallExclusive"), [18]), 'Second integer field invalid message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == '26') {
                        var invalidElem = $('#integer-2 .alpaca-field-invalid');
                        ok(invalidElem.length, 'Input field marked as invalid with value 26.');
                        var messageElem = $('#integer-2 .alpaca-controlfield-message-text');
                        ok(messageElem.length, 'Field invalid message generated.');
                        equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringValueTooLargeExclusive"), [25]), 'Invalid message text populated correctly.');
                    }
                    if (inputElem.val() == '20') {
                        var invalidElem = $('#integer-2 .alpaca-field-invalid');
                        ok(invalidElem.length == 0, 'Input field marked as valid with value 20.');
                    }
                    if (inputElem.val() == '20.1') {
                        var invalidElem = $('#integer-2 .alpaca-field-invalid');
                        ok(invalidElem.length, 'Input field marked as invalid with value 20.1.');
                        var messageElem = $('#integer-2 .alpaca-controlfield-message-text');
                        ok(messageElem.length, 'Field invalid message generated.');
                        equal(messageElem.text(), renderedField.view.getMessage("stringNotAnInteger"), 'Invalid message text populated correctly.');
                    }
                })
                inputElem.val('20');
                inputElem.blur();
                inputElem.val('26');
                inputElem.blur();
                inputElem.val('20.1');
                inputElem.blur();
                start();
            }
        });
    });

    // Test case 3 : Integer field with slider control.
    test("Integer field with data and schema.", function() {
        stop();
        $("#integer-3").alpaca({
            "data": 18,
            "options": {
                "type": "integer",
                "label": "Snow Days:",
                "helper": "Number of Snow Days in January 2011",
                "slider": true
            },
            "schema": {
                minimum: 1,
                maximum: 31
            },
            "postRender": function (renderedField) {
                expect(4);
                var inputElem = $('#integer-3 input:text');
                ok(inputElem.length, 'Input field generated.');
                equal(inputElem.val(), '18', 'Input field value populated correctly.');
                var sliderElem = $('#integer-3 .ui-slider > a');
                ok(sliderElem.length, 'Slider control generated.');
                equal(renderedField.slider.slider( "value"), 18, 'Slider location set correctly.');
                start();
            }
        });
    });
}(jQuery) );