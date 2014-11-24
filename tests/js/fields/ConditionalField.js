(function($) {

    module("fields: conditional");

    // Test case 1 : Conditional field through combination of schema dependency properties and options dependency properties..
    test("Conditional field through combination of schema dependency properties and options dependency properties.", function() {
        stop();
        $("#conditional-1").alpaca({
            "data": {},
            "options": {
                "fields": {
                    "flavour": {
                        "dependencies": {
                            "choice": "Flavour"
                        }
                    },
                    "topping": {
                        "dependencies": {
                            "choice": "Topping"
                        }
                    }
                }
            },
            "schema": {
                "title": "Ice Cream Picker",
                "description": "Select Your Favorite Ice Cream",
                "type": "object",
                "properties": {
                    "choice": {
                        "title": "Select",
                        "type": "String",
                        "description": "What do you want to choose?",
                        "enum": ["Flavour", "Topping"]
                    },
                    "flavour": {
                        "title": "Flavour",
                        "type": "String",
                        "enum": ["Vanilla", "Chocolate", "Coffee", "Strawberry", "Mint"],
                        "dependencies": "choice"
                    },
                    "topping": {
                        "title": "Topping",
                        "type": "String",
                        "enum": ["Marshmelllow", "Chocolate Chip", "Caramel", "Cookie Dough"],
                        "dependencies": "choice"
                    }
                }
            },
            "view": "web-edit",
            "postRender": function (renderedField) {
                expect(11);
                var inputElem = $('#conditional-1 fieldset');
                ok(inputElem.length, 'Object field generated.');
                var fieldElem0 = $('.alpaca-fieldset-items-container > li:eq(0) input:radio:eq(0)', inputElem);
                var fieldContainerElem0 = $('.alpaca-fieldset-items-container > li:eq(0) > span', inputElem);
                ok(fieldElem0.length, 'Input field for choice property generated.');
                notEqual(fieldContainerElem0.css('display'), 'none', 'Input field for choice property shown.');
                var fieldElem0Name = fieldElem0.attr('name');
                var fieldElem0Option0 = fieldElem0;
                var fieldElem0Option1 = $('.alpaca-fieldset-items-container > li:eq(0) input:radio:eq(1)', inputElem);
                var fieldElem0Option2 = $('.alpaca-fieldset-items-container > li:eq(0) input:radio:eq(2)', inputElem);
                var fieldElem1 = $('.alpaca-fieldset-items-container > li:eq(1) select', inputElem);
                var fieldContainerElem1 = $('.alpaca-fieldset-items-container > li:eq(1) > span', inputElem);
                ok(fieldElem1.length, 'Input field for icecream property generated.');
                equal(fieldContainerElem1.css('display'), 'none', 'Input field for icecream property hidden.');
                var fieldElem2 = $('.alpaca-fieldset-items-container > li:eq(2) select', inputElem);
                var fieldContainerElem2 = $('.alpaca-fieldset-items-container > li:eq(2) > span', inputElem);
                ok(fieldElem2.length, 'Input field for topping property generated.');
                equal(fieldContainerElem2.css('display'), 'none', 'Input field for topping property hidden.');
                fieldElem0Option1.change(function() {
                    Alpaca.later(50, renderedField, function() {
                        fieldContainerElem1 = $('.alpaca-fieldset-items-container > li:eq(1) > span');
                        notEqual(fieldContainerElem1.css('display'), 'none', 'Input field for icecream property shown if option Flavour of choice field is selected..');
                        fieldContainerElem2 = $('.alpaca-fieldset-items-container > li:eq(2) > span');
                        equal(fieldContainerElem2.css('display'), 'none', 'Input field for topping property hidden if option Flavour of choice field is selected.');
                        fieldElem0Option2.attr('checked', true);
                        fieldElem0Option2.change();
                    });
                });
                fieldElem0Option2.change(function() {
                    Alpaca.later(50, renderedField, function() {
                        fieldContainerElem1 = $('.alpaca-fieldset-items-container > li:eq(1) > span');
                        equal(fieldContainerElem1.css('display'), 'none', 'Input field for icecream property hidden if option Topping of choice field is selected..');
                        fieldContainerElem2 = $('.alpaca-fieldset-items-container > li:eq(2) > span');
                        notEqual(fieldContainerElem2.css('display'), 'none', 'Input field for topping property shown if option Topping of choice field is selected.');
                        start();
                    });
                });
                fieldElem0Option1.attr('checked', true);
                fieldElem0Option1.change();
            }
        });
    });

}(jQuery) );
