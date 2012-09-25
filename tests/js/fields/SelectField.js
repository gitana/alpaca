(function($) {

    module("fields: select");

    // Test case 1 : Select field with data, schema and options.
    test("Select field with data, schema and options.", function() {
        stop();
        $("#select-1").alpaca({
            "data": "Coffee",
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?"
            },
            "schema": {
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            }
            ,
            "postRender": function (renderedField) {
                expect(4);
                equal(renderedField.getValue(), "Coffee", 'Select field getValue() method returns correct value.')
                var selectElems = $('#select-1 select > option');
                equal(selectElems.length, 6, 'Right number of select options generated.');
                var selectCheckedElem = $('#select-1 select > option:selected');
                equal(selectCheckedElem.length, 1, "Checked select control found.");
                equal(selectCheckedElem.val(), "Coffee", "Right select control checked.")
                start();
            }
        });
    });

    // Test case 2 : Select field with option labels.
    test("Select field with option labels.", function() {
        stop();
        $("#select-2").alpaca({
            "data": "Coffee",
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?",
                "optionLabels": ["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"]
            },
            "schema": {
                "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"]
            },
            "postRender": function (renderedField) {
                expect(6);
                var selectElems = $('#select-2 select > option');
                equal(selectElems.length, 6, 'Right number of select options generated.');
                var selectCheckedElem = $('#select-2 select > option:selected');
                equal(selectCheckedElem.length, 1, "Checked select control found.");
                equal(selectCheckedElem.val(), "Coffee", "Right select control checked.");
                var rightLabelElem0 = $('#select-2 select > option:eq(1)');
                equal(rightLabelElem0.text(), 'Vanilla Flavor', 'First option right label text populated correctly.');
                var rightLabelElem1 = $('#select-2 select > option:eq(2)');
                equal(rightLabelElem1.text(), 'Chocolate Flavor', 'Second option right label text populated correctly.');
                var rightLabelElem2 = $('#select-2 select > option:eq(3)');
                equal(rightLabelElem2.text(), 'Coffee Flavor', 'Third option right label text populated correctly.');
                start();
            }
        });
    });

    // Test case 3 : Select field with options loaded from external data source.
    test("Select field with options loaded from external data source.", function() {
        stop();
        $("#select-3").alpaca({
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?",
                "type": "select",
                "dataSource": "../examples/components/fields/data/icecream-list.html"
            },
            "postRender": function (renderedField) {
                expect(5);
                var selectElems = $('#select-3 select > option');
                equal(selectElems.length, 5, 'Right number of select options generated.');
                var rightLabelElem0 = $('#select-3 select > option:eq(1)');
                equal(rightLabelElem0.text(), 'Vanilla Flavor', 'First option right label text populated correctly.');
                var rightLabelElem1 = $('#select-3 select > option:eq(2)');
                equal(rightLabelElem1.text(), 'Chocolate Flavor', 'Second option right label text populated correctly.');
                var rightLabelElem2 = $('#select-3 select > option:eq(3)');
                equal(rightLabelElem2.text(), 'Strawberry Flavor', 'Third option right label text populated correctly.');
                var rightLabelElem3 = $('#select-3 select > option:eq(4)');
                equal(rightLabelElem3.text(), 'Mint Flavor', 'Fourth option right label text populated correctly.');
                start();
            }
        });
    });

    // Test case 4 : Multiple select field with options loaded from external data source..
    test("Multiple select field with options loaded from external data source.", function() {
        stop();
        $("#select-4").alpaca({
            "data": ["Vanilla", "Chocolate"],
            "options": {
                "label": "Ice cream",
                "helper": "Guess my favorite ice cream?",
                "type": "select",
                "multiple": true,
                "size": 3,
                "dataSource": "../examples/components/fields/data/icecream-list.html"
            },
            "postRender": function (renderedField) {
                expect(10);
                var selectElems = $('#select-4 select > option');
                equal(selectElems.length, 5, 'Right number of select options generated.');
                var rightLabelElem0 = $('#select-4 select > option:eq(1)');
                equal(rightLabelElem0.text(), 'Vanilla Flavor', 'First option right label text populated correctly.');
                var rightLabelElem1 = $('#select-4 select > option:eq(2)');
                equal(rightLabelElem1.text(), 'Chocolate Flavor', 'Second option right label text populated correctly.');
                var rightLabelElem2 = $('#select-4 select > option:eq(3)');
                equal(rightLabelElem2.text(), 'Strawberry Flavor', 'Third option right label text populated correctly.');
                var rightLabelElem3 = $('#select-4 select > option:eq(4)');
                equal(rightLabelElem3.text(), 'Mint Flavor', 'Fourth option right label text populated correctly.');
                var selectedElems = $('#select-4 select > option:selected');
                equal(selectedElems.length, 2, 'Right number of select options generated.');
                var selectedElem0 = $('#select-4 select > option:selected:eq(0)');
                equal(selectedElem0.val(), 'Vanilla', 'Right first option selected.');
                var selectedElem1 = $('#select-4 select > option:selected:eq(1)');
                equal(selectedElem1.val(), 'Chocolate', 'Right second option selected.');
                var selectElem = $('#select-4 select');
                equal(selectElem.attr('size'), '3', 'Select size option set correctly.');
                equal(selectElem.attr('multiple'),'multiple', 'Select multiple option set correctly.');
                start();
            }
        });
    });

}(jQuery) );