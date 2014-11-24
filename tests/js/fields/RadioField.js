(function($) {

    module("fields: radio");

    // Test case 1 : Radio field with data, schema and options.
    test("Radio field with data, schema and options.", function() {
        stop();
        $("#radio-1").alpaca({
            "data": "Coffee",
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?"
            },
            "schema": {
                "enum": ["Vanilla", "Chocolate", "Coffee"]
            },
            "postRender": function (renderedField) {
                expect(4);
                equal(renderedField.getValue(), "Coffee", 'Radio groupd field getValue() method returns correct value.')
                var radioElems = $('#radio-1 input:radio');
                equal(radioElems.length, 4, 'Right number of radio controls generated.');
                var radioCheckedElem = $('#radio-1 input:radio:checked');
                equal(radioCheckedElem.length, 1, "Checked radio control found.");
                equal(radioCheckedElem.val(), "Coffee", "Right radio control checked.")
                start();
            }
        });
    });

    // Test case 2 : Radio field with option labels.
    test("Radio field with option labels.", function() {
        stop();
        $("#radio-2").alpaca({
            "data": "Coffee2",
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?",
                "optionLabels": ["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"]
            },
            "schema": {
                "required": true,
                "enum": ["Vanilla", "Chocolate", "Coffee"]
            },
            "postRender": function (renderedField) {
                expect(12);
                var radioElems = $('#radio-2 input:radio');
                equal(radioElems.length, 3, 'Right number of radio controls generated.');
                var radioCheckedElem = $('#radio-2 input:radio:checked');
                equal(radioCheckedElem.length, 0, "Checked radio control not found.");
                //equal(radioCheckedElem.val(), "Vanilla", "Right radio control checked.");
                ok(!radioCheckedElem.val(), "No radio control checked.");
                var invalidElem = $('#radio-2 .alpaca-field-invalid');
                ok(invalidElem.length, 'Field marked as invalid with value Coffee2.');
                var messageElem = $('#radio-2 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field invalid message generated.');
                var subst = Alpaca.substituteTokens(renderedField.view.getMessage("invalidValueOfEnum"), ["Vanilla,Chocolate,Coffee"], "");
                ok(messageElem.text().indexOf(subst) > -1, 'Invalid message text populated correctly.');
                var rightLabelElem0 = $('#radio-2 .alpaca-controlfield-radio-label:eq(0)');
                ok(rightLabelElem0.length, 'First option right label generated.');
                equal(rightLabelElem0.text(),'Vanilla Flavor','First option right label text populated correctly.')
                var rightLabelElem1 = $('#radio-2 .alpaca-controlfield-radio-label:eq(1)');
                ok(rightLabelElem1.length, 'Second option right label generated.');
                equal(rightLabelElem1.text(),'Chocolate Flavor','Second option right label text populated correctly.')
                var rightLabelElem2 = $('#radio-2 .alpaca-controlfield-radio-label:eq(2)');
                ok(rightLabelElem2.length, 'Third option right label generated.');
                equal(rightLabelElem2.text(),'Coffee Flavor','Third option right label text populated correctly.')
                start();
            }
        });
    });

    // Test case 3 : Radio field with option labels and integer value.
    test("Radio field with option labels.", function() {
        stop();
        $("#radio-3").alpaca({
            "data": 3,
            "options": {
                "label": "Rate My Ice cream",
                "helper": "Please rate my ice cream",
                "optionLabels": ["Bad", "Ok", "Good"]
            },
            "schema": {
                "required": true,
                "enum": [1, 2, 3]
            },
            "postRender": function (renderedField) {
                expect(10);
                var radioElems = $('#radio-3 input:radio');
                equal(radioElems.length, 3, 'Right number of radio controls generated.');
                var radioCheckedElem = $('#radio-3 input:radio:checked');
                equal(radioCheckedElem.length, 1, "Checked radio control found.");
                equal(radioCheckedElem.val(), "3", "Right radio control checked.");
                var rightLabelElem0 = $('#radio-3 .alpaca-controlfield-radio-label:eq(0)');
                ok(rightLabelElem0.length, 'First option right label generated.');
                equal(rightLabelElem0.text(),'Bad','First option right label text populated correctly.');
                var rightLabelElem1 = $('#radio-3 .alpaca-controlfield-radio-label:eq(1)');
                ok(rightLabelElem1.length, 'Second option right label generated.');
                equal(rightLabelElem1.text(),'Ok','Second option right label text populated correctly.');
                var rightLabelElem2 = $('#radio-3 .alpaca-controlfield-radio-label:eq(2)');
                ok(rightLabelElem2.length, 'Third option right label generated.');
                equal(rightLabelElem2.text(),'Good','Third option right label text populated correctly.');
                ok(renderedField.getValue()===3, 'Return value with right type.');
                start();
            }
        });
    });

    // Test case 4 : Radio field with option labels and integer value.
    test("Radio field for boolean type.", function() {
        stop();
        $("#radio-4").alpaca({
            "data": false,
            "options": {
                "type" : "radio",
                "label": "Rate My Ice cream",
                "helper": "Please rate my ice cream",
                "optionLabels": ["Good", "Bad"]
            },
            "schema": {
                "type" : "boolean",
                "required": true,
                "default" : true,
                "enum": [true,false]
            },
            "postRender": function (renderedField) {
                expect(1);
                ok(renderedField.getValue()===false, 'Return value with right type.');
                start();
            }
        });
    });
}(jQuery) );