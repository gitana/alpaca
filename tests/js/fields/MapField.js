(function($) {

    module("fields: map");

    // Test case 1 : map field.
    test("Map field.", function() {
        stop();
        $("#map-1").alpaca({
            "data": {
                "john316" : {
                    "firstName" : "Tim",
                    "lastName" : "Tebow",
                    "gender" : "Male"

                }
            },
            "schema": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "_key" : {
                            "title" : "User Id"
                        },
                        "firstName" : {
                            "title" : "First Name",
                            "description" : "Enter user's first name."
                        },
                        "lastName" : {
                            "title" : "Last Name",
                            "description" : "Enter user's last name."
                        },
                        "gender" : {
                            "title" : "Gender",
                            "description" : "Select user's gender",
                            "enum" : ["Male","Female"]
                        }
                    }
                }
            },
            "options" : {
                "type" : "map",
                "fields": {
                    "item" : {
                        "fields" : {
                            "_key" : {
                                "size" : 60,
                                "helper" : "Provide a unique user id."
                            }
                        }
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(15);

                // click on the "toolbar add" button to create a new element
                // the new element will be empty which will be invalid since we require a key
                var arrayToolBarAddButton = $('#map-1 .alpaca-fieldset-array-item-toolbar-add');
                ok(arrayToolBarAddButton.length, 'Array toolbar with add button generated.');
                simulateClick(arrayToolBarAddButton, function() {

                    var objectFieldSetItem = $('#map-1 .alpaca-fieldset-items-container fieldset:eq(0)');
                    var objectFieldSetItemId = objectFieldSetItem.attr('alpaca-field-id');
                    ok(objectFieldSetItem.length, 'New object field generated.');
                    var inputElem0 = $('input:text:eq(0)', objectFieldSetItem);
                    ok(inputElem0.length, 'New object first text input field generated.');
                    equal(inputElem0.val(), 'john316', 'Id field for new object populated with correct value.');
                    var inputElem0Id = inputElem0.attr('id');
                    var inputElem0LabelElem = $('#' + inputElem0Id + '-controlfield-label > div', objectFieldSetItem);
                    ok(inputElem0LabelElem.length, 'Label for new object first text input field generated.');
                    equal(inputElem0LabelElem.text(), 'User Id', 'Label for new object first text input field populated with correct text.');
                    var inputElem1 = $('input:text:eq(1)', objectFieldSetItem);
                    ok(inputElem1.length, 'New object second text input field generated.');
                    var inputElem1Id = inputElem1.attr('id');
                    var inputElem1LabelElem = $('#' + inputElem1Id + '-controlfield-label > div', objectFieldSetItem);
                    ok(inputElem1LabelElem.length, 'Label for new object second text input field generated.');
                    equal(inputElem1LabelElem.text(), 'First Name', 'Label for second object first text input field populated with correct text.');
                    var arrayElem = $('#map-1 fieldset.alpaca-field-invalid');
                    ok(arrayElem.length, 'Array marked as invalid.');
                    var arrayId = arrayElem.attr('alpaca-field-id');

                    var arrayMessageElem = $('#map-1 #' + arrayId + '-field-message-0 > .alpaca-controlfield-message-text');
                    ok(arrayMessageElem.length, 'Array invalid message generated.');
                    equal(arrayMessageElem.text(), renderedField.view.getMessage("keyMissing"), 'Array invalid text populated correctly.');

                    // now fill in the new entry using john326, should then be valid
                    var objectFieldSetItem2 = $('#map-1 .alpaca-fieldset-items-container fieldset:eq(1)');
                    $('input:text:eq(0)', objectFieldSetItem2).val("john326").blur();
                    // verify it's now valid
                    var invalidElem = $('#map-1 fieldset.alpaca-field-invalid');
                    ok(invalidElem.length == 0, 'Array marked as valid with new key.');
                    var updatedVal = renderedField.getValue();
                    ok(updatedVal['john316']!= null, 'Map value contains john316 key');
                    ok(updatedVal['john326']!= null, 'Map value contains john326 key');

                    start();
                });
            }
        });
    });

}(jQuery) );