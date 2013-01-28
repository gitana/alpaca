(function($) {

    module("fields: array");

    // Test case 1 : Array field with only array data input.
    test("Array field with only array data input", function() {
        stop();
        $("#array-1").alpaca({
            "data": ["test1", "test2", "test3"],
            "postRender": function (renderedField) {
                expect(20);
                var inputElem0 = $('#array-1 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'test1', 'First input field value populated correctly.');
                var inputElem1 = $('#array-1 input:text:eq(1)');
                ok(inputElem1.length, 'Second text input field generated.');
                equal(inputElem1.val(), 'test2', 'Second input field value populated correctly.');
                var inputElem2 = $('#array-1 input:text:eq(2)');
                ok(inputElem2.length, 'Third text input field generated.');
                equal(inputElem2.val(), 'test3', 'Third input field value populated correctly.');
                // test array item toolbar
                inputElem0.hover(function() {
                    var id = inputElem0.attr('id');
                    var itemArrayBar = $("#array-1 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                    ok(itemArrayBar.length, 'First item toolbar generated.');
                    var buttons = $('button', itemArrayBar);
                    equal(buttons.length, 4, 'Four buttons generated.');
                    // simulate add
                    var addButton = $('button.alpaca-fieldset-array-item-toolbar-add', itemArrayBar);
                    ok(addButton.length, 'Add button generated.');
                    addButton.click(function() {
                        var newInputElem = $('#array-1 input:text:eq(1)');
                        ok(newInputElem.length, 'New text input field generated.');
                        //equal(newInputElem.val(), 'test1', 'New input field value populated correctly.');
                        // new elements populate with empty value
                        equal(newInputElem.val(), '', 'New input field value populated correctly.');
                        // simulate remove
                        var newId = newInputElem.attr('id');
                        var newItemArrayBar = $("#array-1 #" + newId + "-item-container > .alpaca-fieldset-array-item-toolbar");
                        var removeButton = $('button.alpaca-fieldset-array-item-toolbar-remove', newItemArrayBar);
                        ok(removeButton.length, 'Remove button generated.');
                        removeButton.click(function() {
                            var inputElems = $('#array-1 input:text');
                            equal(inputElems.length, 3, 'Item removed successfully.');
                            // simulate up
                            var upButton = $('button.alpaca-fieldset-array-item-toolbar-up', itemArrayBar);
                            ok(upButton.length, 'Up button generated.');
                            upButton.click(function() {
                                var newInputElem0 = $('#array-1 input:text:eq(0)');
                                equal(newInputElem0.val(), 'test3', 'New first input field value populated correctly.');
                                var newInputElem2 = $('#array-1 input:text:eq(2)');
                                equal(newInputElem2.val(), 'test1', 'New last input field value populated correctly.');
                                // simulate down
                                itemArrayBar = $("#array-1 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                                var downButton = $('button.alpaca-fieldset-array-item-toolbar-down', itemArrayBar);
                                ok(downButton.length, 'Down button generated.');
                                downButton.click(function() {
                                    var newInputElem00 = $('#array-1 input:text:eq(0)');
                                    equal(newInputElem00.val(), 'test1', 'New first input field value populated correctly.');
                                    var newInputElem22 = $('#array-1 input:text:eq(2)');
                                    equal(newInputElem22.val(), 'test3', 'New last input field value populated correctly.');
                                });
                                downButton.click();
                            });
                            upButton.click();
                        });
                        removeButton.click();
                    });
                    addButton.click();
                }, function() {
                    var id = inputElem0.attr('id');
                    var itemArrayBar = $("#array-1 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                    ok(itemArrayBar.length, 'First item toolbar generated.');
                    inputElem0.mouseenter();
                });
                inputElem0.mouseleave();
                start();
            }
        });
    });

    // Test case 2 : Array field with options and schema.
    test("Array field with options and schema", function() {
        stop();
        $("#array-2").alpaca({
            "data": ["M"],
            "options": {
                "label": "Ice Cream",
                "helper": "Favorite Ice Cream",
                "itemLabel": "Favorite"
            },
            "schema": {
                "description": "My Favorite Ice Creams",
                "type": "array",
                "items": {
                    "title": "Ice Cream",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 8,
                    "minItems": 2,
                    "maxItems": 2
                }
            },
            "postRender": function (renderedField) {
                expect(22);
                var inputElem0 = $('#array-2 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'M', 'First input field value populated correctly.');
                var id = inputElem0.attr('id');
                var arrayHelperItem = $('#array-2 .alpaca-fieldset-helper');
                ok(arrayHelperItem.length, 'Array helper generated.');
                equal(arrayHelperItem.text(), 'Favorite Ice Cream', 'Array helper text populated correctly.');
                var item0LabelElem = $('#array-2 #' + id + '-item-container > .alpaca-controlfield-label > div');
                ok(item0LabelElem.length, 'Item label generated.');
                equal(item0LabelElem.text(), 'Favorite 1', 'Item label text populated correctly.');
                var inputElem0LabelElem = $('#array-2 #' + id + '-controlfield-label > div');
                ok(inputElem0LabelElem.length, 'Array item label generated.');
                equal(inputElem0LabelElem.text(), 'Ice Cream', 'Array item label text populated correctly.');
                var inputElem0MessageElem = $('#array-2 #' + id + '-field-message-0 > .alpaca-controlfield-message-text');
                ok(inputElem0MessageElem.length, 'Array item invalid message generated.');
                equal(inputElem0MessageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringTooShort"), [3]), 'Array item invalid text populated correctly.');
                var arrayElem = $('#array-2 fieldset.alpaca-field-invalid');
                ok(arrayElem.length, 'Array marked as invalid.');
                var arrayId = arrayElem.attr('alpaca-field-id');
                var arrayMessageElem = $('#array-2 #' + arrayId + '-field-message-0 > .alpaca-controlfield-message-text');
                ok(arrayMessageElem.length, 'Array invalid message generated.');
                equal(arrayMessageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("notEnoughItems"), [2]), 'Array invalid text populated correctly.');

                // test array item toolbar
                inputElem0.hover(function() {
                    var id = inputElem0.attr('id');
                    var itemArrayBar = $("#array-2 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                    ok(itemArrayBar.length, 'First item toolbar generated.');
                    var removeButton = $('button.alpaca-fieldset-array-item-toolbar-remove', itemArrayBar);
                    ok(removeButton.length, 'Remove button generated.');
                    var removeButtonDisabled = removeButton.button("option", "disabled");
                    ok(removeButtonDisabled, 'Remove button disabled.');
                    // simulate add
                    var addButton = $('button.alpaca-fieldset-array-item-toolbar-add', itemArrayBar);
                    ok(addButton.length, 'Add button generated.');
                    addButton.click(function() {
                        var newInputElem = $('#array-2 input:text:eq(1)');
                        ok(newInputElem.length, 'New text input field generated.');
                        //equal(newInputElem.val(), 'M', 'New input field value populated correctly.');
                        // new elements populate with empty value
                        equal(newInputElem.val(), '', 'New input field value populated correctly.');
                        var arrayMessageElem = $('#array-2 #' + arrayId + '-field-message-0');
                        ok(arrayMessageElem.length == 0, 'Array invalid message removed.');
                        itemArrayBar = $("#array-2 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                        addButton = $('button.alpaca-fieldset-array-item-toolbar-add', itemArrayBar);
                        var addButtonDisabled = addButton.button("option", "disabled");
                        ok(addButtonDisabled, 'Add button disabled.');
                    });
                    addButton.click();
                }, function() {
                    var id = inputElem0.attr('id');
                    var itemArrayBar = $("#array-2 #" + id + "-item-container > .alpaca-fieldset-array-item-toolbar");
                    ok(itemArrayBar.length, 'First item toolbar generated.');
                    inputElem0.mouseenter();
                });
                inputElem0.mouseleave();
                start();
            }
        });
    });

    // Test case 3 : Array field with array default value.
    test("Array field with array default value", function() {
        stop();
        $("#array-3").alpaca({
            "schema": {
                "description": "My Favorite Ice Creams",
                "type": "array",
                "default": '["Vanilla","Mint","Moose Track"]',
                "items": {
                    "title": "Ice Cream",
                    "type": "string",
                    "minLength": 3,
                    "maxLength": 8,
                    "minItems": 2,
                    "maxItems": 5
                }
            },
            "postRender": function (renderedField) {
                expect(6);
                var inputElem0 = $('#array-3 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'Vanilla', 'First input field value populated correctly.');
                var inputElem1 = $('#array-3 input:text:eq(1)');
                ok(inputElem1.length, 'Second text input field generated.');
                equal(inputElem1.val(), 'Mint', 'Second input field value populated correctly.');
                var inputElem2 = $('#array-3 input:text:eq(2)');
                ok(inputElem2.length, 'Third text input field generated.');
                equal(inputElem2.val(), 'Moose Track', 'Third input field value populated correctly.');
                start();
            }
        });
    });

    // Test case 4 : Array field with string default value.
    test("Array field with string default value", function() {
        stop();
        $("#array-4").alpaca({
            "schema": {
                "description": "My Favorite Ice Creams",
                "type": "array",
                "default": "Vanilla",
                "items": {
                    "title": "Ice Cream",
                    "type": "string"
                }
            },
            "postRender": function (renderedField) {
                expect(2);
                var inputElem0 = $('#array-4 input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'Vanilla', 'First input field value populated correctly.');
                start();
            }
        });
    });

    // Test case 5 : Array field with item type as object.
    test("Array field with item type as object", function() {
        stop();
        $("#array-5").alpaca({
            "schema": {
                "description": "My Favorite Ice Creams",
                "type": "array",
                "items": {
                    "title": "Ice Cream",
                    "type": "object",
                    "properties": {
                        "flavor": {
                            "title": "Flavor",
                            "description": "Ice cream flavor",
                            "type": "string"
                        },
                        "topping": {
                            "title": "Topping",
                            "description": "Ice cream topping",
                            "type": "string"
                        }
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(9);
                var arrayToolBarAddButton = $('#array-5 .alpaca-fieldset-array-toolbar-add');
                ok(arrayToolBarAddButton.length, 'Array toolbar with add button generated.');
                arrayToolBarAddButton.click(function() {
                    var objectFieldSetItem = $('#array-5 .alpaca-fieldset-items-container fieldset');
                    var objectFieldSetItemId = objectFieldSetItem.attr('alpaca-field-id');
                    ok(objectFieldSetItem.length, 'New object field generated.');
                    var inputElem0 = $('input:text:eq(0)', objectFieldSetItem);
                    ok(inputElem0.length, 'New object first text input field generated.');
                    var inputElem0Id = inputElem0.attr('id');
                    var inputElem0LabelElem = $('#' + inputElem0Id + '-controlfield-label > div', objectFieldSetItem);
                    ok(inputElem0LabelElem.length, 'Label for new object first text input field generated.');
                    equal(inputElem0LabelElem.text(), 'Flavor', 'Label for new object first text input field populated with correct text.');
                    var inputElem1 = $('input:text:eq(1)', objectFieldSetItem);
                    ok(inputElem1.length, 'New object second text input field generated.');
                    var inputElem1Id = inputElem1.attr('id');
                    var inputElem1LabelElem = $('#' + inputElem1Id + '-controlfield-label > div', objectFieldSetItem);
                    ok(inputElem1LabelElem.length, 'Label for new object second text input field generated.');
                    equal(inputElem1LabelElem.text(), 'Topping', 'Label for second object first text input field populated with correct text.');
                    var arrayItemToolBarRemoveButton = $('#array-5 #' + objectFieldSetItemId + '-item-container .alpaca-fieldset-array-item-toolbar .alpaca-fieldset-array-item-toolbar-remove');
                    arrayItemToolBarRemoveButton.click(function() {
                        arrayToolBarAddButton = $('#array-5 .alpaca-fieldset-array-toolbar-add');
                        ok(arrayToolBarAddButton.length, 'Array toolbar re-generated once all items are removed.');
                    });
                    arrayItemToolBarRemoveButton.click();
                });
                arrayToolBarAddButton.click();
                start();
            }
        });
    });

    // Test case 6 : Nested array field.
    test("Nested array field", function() {
        stop();
        $("#array-6").alpaca({
            "schema": {
                "description": "Ice Cream Prices",
                "type": "array",
                "items": {
                    "title": "Flavor Price",
                    "type": "array",
                    "items": {
                        "title": "Price",
                        "type": "number"
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(4);
                var arrayToolBarAddButton = $('#array-6 .alpaca-fieldset-array-toolbar-add');
                ok(arrayToolBarAddButton.length, 'Array toolbar with add button generated.');
                arrayToolBarAddButton.click(function() {
                    var objectFieldSetItem = $('#array-6 .alpaca-fieldset-items-container fieldset');
                    ok(objectFieldSetItem.length, 'New array item field generated.');
                    var subArrayToolBarAddButton = $('.alpaca-fieldset-array-toolbar .alpaca-fieldset-array-toolbar-add', objectFieldSetItem);
                    ok(subArrayToolBarAddButton.length, 'Sub array toolbar with add button generated.');
                    subArrayToolBarAddButton.click(function() {
                        var inputElem0 = $('input:text:eq(0)', objectFieldSetItem);
                        ok(inputElem0.length, 'Sub array item text input field generated.');
                    });
                    subArrayToolBarAddButton.click();
                });
                arrayToolBarAddButton.click();
                start();
            }
        });
    });
}(jQuery) );