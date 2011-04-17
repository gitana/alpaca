(function($) {

    module("fields: object");

    // Test case 1 : Simple object field with only object data input.
    test("Simple object field with only object data input.", function() {
        stop();
        $("#object-1").alpaca({
            "data": {
                name: "Taylor Swift",
                age: 18
            },
            "postRender": function (renderedField) {
                expect(4);
                var inputElem0 = $('#object-1 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'Taylor Swift', 'First input field value populated correctly.');
                var inputElem1 = $('#object-1 input:text:eq(1)');
                ok(inputElem1.length, 'Second text input field generated.');
                equal(inputElem1.val(), '18', 'Second input field value populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Object field with data and schema.
    test("Object field with data and schema.", function() {
        stop();
        $("#object-2").alpaca({
            "data": {
                name: "Taylor Swift",
                age: 18
            },
            "schema": {
                "title": "Customer Profile",
                "description": "Customer Contact Information",
                "type": "object",
                "properties": {
                    "name": {
                        "title": "Full Name",
                        "description": "Enter Your Full Name",
                        "type": "string"
                    },
                    "age": {
                        "title": "Age",
                        "type": "number"
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(12);
                var inputElem0 = $('#object-2 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'Taylor Swift', 'First input field value populated correctly.');
                var id0 = inputElem0.attr('id');
                var inputElem0LabelElem = $('#object-2 #' + id0 + '-controlfield-label > div');
                ok(inputElem0LabelElem.length, 'First text input field label generated.');
                equal(inputElem0LabelElem.text(), 'Full Name', 'First input field label text populated correctly.');
                var inputElem0HelperElem = $('#object-2 #' + id0 + '-controlfield-helper .alpaca-controlfield-helper-text');
                ok(inputElem0HelperElem.length, 'First text input field helper generated.');
                equal(inputElem0HelperElem.text(), 'Enter Your Full Name', 'First input field helper text populated correctly.');
                var inputElem1 = $('#object-2 input:text:eq(1)');
                ok(inputElem1.length, 'Second text input field generated.');
                equal(inputElem1.val(), '18', 'Second input field value populated correctly.');
                var id = $('#object-2 fieldset').attr('alpaca-field-id');
                var fieldSetLabelItem = $('#object-2 fieldset legend');
                ok(fieldSetLabelItem.length, 'Fieldset label generated.');
                equal(fieldSetLabelItem.text(), 'Customer Profile', 'Fieldset label text populated correctly');
                var fieldSetHelperItem = $('#object-2 fieldset .alpaca-fieldset-helper');
                ok(fieldSetHelperItem.length, 'Fieldset helper generated.');
                equal(fieldSetHelperItem.text(), 'Customer Contact Information', 'Fieldset helper text populated correctly');
                start();
            }
        });
    });

    // Test case 3 : Object field with data, options and schema.
    test("Object with data and schema.", function() {
        stop();
        var initData = {
            name: "James Bond",
            age: 45,
            icecream: ["Chocolate", "Vanilla", "Strawberry"],
            address: {
                street: ["100 Main Street", "Suite 200"],
                city: "Burlington",
                state: "MA",
                zip: "18210"
            }
        };
        $("#object-3").alpaca({
            "data": initData,
            "schema": {
                "title": "Customer Profile",
                "description": "Alpaca Ice Cream Customer Profile",
                "type": "object",
                "properties": {
                    "name": {
                        "title": "Full Name",
                        "type": "string"
                    },
                    "age": {
                        "title": "Age",
                        "type": "number"
                    },
                    "icecream": {
                        "title": "Favorite Ice Cream",
                        "type": "array"
                    },
                    "address": {
                        "title": "Home Address",
                        "type": "object",
                        "properties": {
                            "street": {
                                "title": "Street Address",
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "maxLength": 30,
                                    "minItems": 1,
                                    "maxItems": 3
                                }
                            },
                            "city": {
                                "title": "City",
                                "type": "string"
                            },
                            "state": {
                                "title": "State",
                                "type": "string"
                            },
                            "zip": {
                                "title": "Zip Code",
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "options": {
                "fields": {
                    "address": {
                        "fields": {
                            "street": {
                                "collapsed": true,
                                "itemLabel": "Line"
                            }
                        }
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(5);
                deepEqual(renderedField.getValue(), initData, 'Object field getValue() method returns correct value.');
                var addressFieldSetElem = $('#object-3 > fieldset > .alpaca-fieldset-items-container > div:eq(3) > fieldset');
                ok(addressFieldSetElem.length, 'Fieldset for address field generated.');
                var streetFieldElem = $('.alpaca-fieldset-items-container fieldset', addressFieldSetElem);
                ok(streetFieldElem.length, 'Fieldset for street field generated.');
                //var displayStyle = $('.alpaca-fieldset-items-container',streetFieldElem).css('display');
                //equal(displayStyle,'none',"Street field collapsed initially.")
                var streetFieldItemLabel0Elem = $('.alpaca-controlfield-label:eq(0)', streetFieldElem);
                ok(streetFieldItemLabel0Elem.length, 'Street field label generated.');
                equal(streetFieldItemLabel0Elem.text(), 'Line 1', "Street field label text populated correctly.")
                start();
            }
        });
    });

    // Test case 4 : Object field with default value.
    test("Object field with default value.", function() {
        stop();
        $("#object-4").alpaca({
            "schema": {
                "title": "Customer Profile",
                "description": "Customer Contact Information",
                "type": "object",
                "default": '{"name":"Taylor Swift","age":18}',
                "properties": {
                    "name": {
                        "title": "Full Name",
                        "description": "Enter Your Full Name",
                        "type": "string"
                    },
                    "age": {
                        "title": "Age",
                        "type": "number"
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(12);
                var inputElem0 = $('#object-4 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'Taylor Swift', 'First input field value populated correctly.');
                var id0 = inputElem0.attr('id');
                var inputElem0LabelElem = $('#object-4 #' + id0 + '-controlfield-label > div');
                ok(inputElem0LabelElem.length, 'First text input field label generated.');
                equal(inputElem0LabelElem.text(), 'Full Name', 'First input field label text populated correctly.');
                var inputElem0HelperElem = $('#object-4 #' + id0 + '-controlfield-helper .alpaca-controlfield-helper-text');
                ok(inputElem0HelperElem.length, 'First text input field helper generated.');
                equal(inputElem0HelperElem.text(), 'Enter Your Full Name', 'First input field helper text populated correctly.');
                var inputElem1 = $('#object-4 input:text:eq(1)');
                ok(inputElem1.length, 'Second text input field generated.');
                equal(inputElem1.val(), '18', 'Second input field value populated correctly.');
                var id = $('#object-4 fieldset').attr('alpaca-field-id');
                var fieldSetLabelItem = $('#object-4 fieldset legend');
                ok(fieldSetLabelItem.length, 'Fieldset label generated.');
                equal(fieldSetLabelItem.text(), 'Customer Profile', 'Fieldset label text populated correctly');
                var fieldSetHelperItem = $('#object-4 fieldset .alpaca-fieldset-helper');
                ok(fieldSetHelperItem.length, 'Fieldset helper generated.');
                equal(fieldSetHelperItem.text(), 'Customer Contact Information', 'Fieldset helper text populated correctly');
                start();
            }
        });
    });
}(jQuery) );