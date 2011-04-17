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
                equal(radioCheckedElem.length, 1, "Checked radio control found.");
                equal(radioCheckedElem.val(), "Vanilla", "Right radio control checked.");
                var invalidElem = $('#radio-2 .alpaca-field-invalid');
                ok(invalidElem.length, 'Field marked as invalid with value Coffee2.');
                var messageElem = $('#radio-2 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field invalid message generated.');
                equal(messageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("invalidValueOfEnum"), ["Vanilla,Chocolate,Coffee"]), 'Invalid message text populated correctly.');
                var rightLabelElem0 = $('#radio-2 .alpaca-controlfield-radio-label:eq(0)');
                ok(rightLabelElem0.length, 'First option right label generated.');
                equal(rightLabelElem0.text(),'Vanilla Flavor','First option right label text populated correctly.')
                var rightLabelElem1 = $('#radio-2 .alpaca-controlfield-radio-label:eq(1)');
                ok(rightLabelElem1.length, 'Second option right label generated.');
                equal(rightLabelElem1.text(),'Chocolate Flavor','Second option right label text populated correctly.')
                var rightLabelElem2 = $('#radio-2 .alpaca-controlfield-radio-label:eq(2)');
                ok(rightLabelElem2.length, 'Third option right label generated.');
                equal(rightLabelElem2.text(),'Coffee Flavor','First option right label text populated correctly.')
                start();
            }
        });
    });


}(jQuery) );