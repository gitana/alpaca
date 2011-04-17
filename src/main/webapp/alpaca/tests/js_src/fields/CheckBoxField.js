(function($) {

    module("fields: checkbox");

    // Test case 1 : Simple checkbox field with only boolean data input.
    test("Simple checkbox field with only boolean data input", function() {
        stop();
        $("#checkbox-1").alpaca({
            "data": false,
            "postRender": function (renderedField) {
                expect(2);
                var inputElem = $('#checkbox-1 input:checkbox');
                ok(inputElem.length, 'Checkbox input field generated.');
                equal(inputElem.is(':checked'), false, 'Checkbox field value populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Checkbox field with label and right label.
    test("Checkbox field with label and right label", function() {
        stop();
        $("#checkbox-2").alpaca({
            "data": true,
            "options": {
                "label": "Question:",
                "rightLabel": "Do you like Alpaca?"
            },
            "postRender": function (renderedField) {
                expect(6);
                var inputElem = $('#checkbox-2 input:checkbox');
                ok(inputElem.length, 'Checkbox input field generated.');
                equal(inputElem.is(':checked'), true, 'Checkbox field value populated correctly.');
                var labelElem = $('#checkbox-2 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Checkbox field label generated.');
                equal(labelElem.text(), 'Question:', 'Label text populated correctly.');
                var rightLabelElem = $('#checkbox-2 .alpaca-controlfield-checkbox > span > label');
                ok(rightLabelElem.length, 'Checkbox field right label generated.');
                equal(rightLabelElem.text(), 'Do you like Alpaca?', 'Right label text populated correctly.');
                start();
            }
        });
    });

}(jQuery) );
