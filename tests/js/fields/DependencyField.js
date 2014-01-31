(function($) {

    module("fields: dependency");

    // Test case 1 : Field dependency through schema dependency properties.
    test("Field dependency through schema dependency properties.", function() {
        stop();
        $("#dependency-1").alpaca({
            "data": {},
            "schema": {
                "title": "Survey",
                "description": "Please participate in our survey",
                "type": "object",
                "properties": {
                    "fan": {
                        "title": "Are you an Ice Cream fanatic?",
                        "type": "boolean"
                    },
                    "icecream": {
                        "title": "What is your Favorite Ice Cream?",
                        "type": "String",
                        "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"],
                        "dependencies": "fan"
                    },
                    "topping": {
                        "title": "What is your Favorite Topping?",
                        "type": "String",
                        "enum": ["Marshmelllow", "Chocolate Chip", "Caramel", "Cookie Dough"],
                        "dependencies": ["icecream"]
                    }
                }
            },
            "options": {
                "fields": {
                    "fan": {
                        "rightLabel": "Why yes, I am..."
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(9);
                var inputElem = $('#dependency-1 fieldset');
                ok(inputElem.length, 'Object field generated.');
                var fieldElem0 = $('.alpaca-fieldset-items-container > div:eq(0) input:checkbox',inputElem);
                var fieldContainerElem0 = $('.alpaca-fieldset-items-container > div:eq(0) > span',inputElem);
                ok(fieldElem0.length, 'Input field for fan property generated.');
                notEqual(fieldContainerElem0.css('display'), 'none', 'Input field for fan property shown.');
                var fieldElem1 = $('.alpaca-fieldset-items-container > div:eq(1) select',inputElem);
                var fieldContainerElem1 = $('.alpaca-fieldset-items-container > div:eq(1) > span',inputElem);
                ok(fieldElem1.length, 'Input field for icecream property generated.');
                equal(fieldContainerElem1.css('display'), 'none', 'Input field for icecream property hidden.');
                var fieldElem2 = $('.alpaca-fieldset-items-container > div:eq(2) select',inputElem);
                var fieldContainerElem2 = $('.alpaca-fieldset-items-container > div:eq(2) > span',inputElem);
                ok(fieldElem2.length, 'Input field for topping property generated.');
                equal(fieldContainerElem2.css('display'), 'none', 'Input field for topping property hidden.');
                fieldElem0.change(function() {
                    fieldContainerElem1 = $('.alpaca-fieldset-items-container > div:eq(1) > span');
                    notEqual(fieldContainerElem1.css('display'), 'none', 'Input field for icecream property shown after checkbox for fan property is checked.');
                    fieldElem1.change(function() {
                        fieldContainerElem2 = $('.alpaca-fieldset-items-container > div:eq(2) > span');
                        notEqual(fieldContainerElem2.css('display'), 'none', 'Input field for topping property shown after select for icecream property is selected.');
                    });

                    // pick the "Vanilla" option in the icecream dropdown, causes dependencies to recalculate and "toppings" to display
                    fieldElem1.val( 'Vanilla' ).attr('selected',true);
                    fieldElem1.change();
                });
                // click the "fan" checkbox, causes dependencies to recalculate and new "icecream" to display
                fieldElem0.prop("checked", true);
                fieldElem0.change();
                start();
            }
        });
    });

}(jQuery) );