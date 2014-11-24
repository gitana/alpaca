(function($) {

    module("fields: address", {
        "setup": function() {
            $("#qunit-fixture").append('<div id="address-fixture"></div>');
        },
        "teardown": function() {
            $("#address-fixture").remove();
        }
    });

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
        $("#address-fixture").alpaca({
            "view": "bootstrap-edit",
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
                var inputElem = $('#address-fixture .alpaca-field-address');
                ok(inputElem.length, 'Address input field generated.');
                var selectOptionElems = $('select > option', inputElem);
                equal(selectOptionElems.length, 60, 'Address state select field generated correctly.');
                var zipElem = $('input.alpaca-control[name="zip"]', inputElem);
                ok(zipElem.length, 'Address zip field generated correctly.');
                equal(parseInt(zipElem.attr('size')), 5, 'Address zip field generated with right size.');
                zipElem.focus(function() {
                    equal(zipElem.val(), "_____", "Address zip field text mask generated correctly.");
                    start();
                });
                zipElem.val('');
                zipElem.focus();
            }
        });
    });

})(jQuery);
