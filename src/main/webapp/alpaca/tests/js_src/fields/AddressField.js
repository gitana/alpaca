(function($) {

    module("fields: address");

    // Test case 1 : Address field with options.
    test("Address field with options.", function() {
        stop();
        var data = {
            "street":[
                "100 Main Street",
                "Suite 200"
            ],
            "city":"Burlington",
            "state":"MA",
            "zip":"18210"
        };
        $("#address-1").alpaca({
            "data": data,
            "options": {
                "type": "address",
                "addressValidation": true
            },
            "schema": {
                "title": "Home Address",
                "type": "any"
            },
            "postRender": function (renderedField) {
                expect(7);
                deepEqual(renderedField.getValue(), data, 'Address field getValue() method returns correct value.');
                equal(renderedField.getAddress(), '100 Main Street Suite 200 Burlington MA 18210', 'Address field getAddress() method returns correct value.');
                var inputElem = $('#address-1 fieldset');
                ok(inputElem.length, 'Address input field generated.');
                var selectOptionElems = $('select > option', inputElem);
                equal(selectOptionElems.length, 60, 'Address state select field generated correctly.');
                var zipElem = $('.alpaca-fieldset-items-container > div:eq(3) input:text', inputElem);
                ok(zipElem.length, 'Address zip field correctly.');
                equal(zipElem.attr('size'), 5, 'Address zip field generated with right size.');
                zipElem.focus(function() {
                    equal(zipElem.val(), "_____", "Address zip field text mask generated correctly.");
                });
                zipElem.val('');
                zipElem.focus();
                start();
            }
        });
    });

}(jQuery) );