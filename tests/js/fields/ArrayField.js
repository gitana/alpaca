(function($) {

    module("fields: array", {
        "setup": function() {
            $("#qunit-fixture").append('<div id="array-fixture"></div>');

            $.fn.getArrayBar = function() {
                var $this = $(this[0]);
                var id    = $this.attr('id');
                return $('[data-alpaca-field-id="' + id + '"] > .alpaca-array-actionbar');
            };
        },
        "teardown": function() {
            $("#address-fixture").remove();

            delete $.fn.getArrayBar;
        }
    });


    // Test case 1 : Array field with only array data input.
    test("Array field with only array data input", function() {
        stop();
        var el   = $('#array-fixture');
        var data = ["foo", "bar", "baz"];
        el.alpaca({
            "data": data,
            "postRender": function (renderedField) {
                expect(17);

                var inputFields = el.find('input');
                equal(inputFields.length, 3, 'Input fields generated correctly.');

                $.each(inputFields, function(i, v) {
                    equal($(v).val(), data[i], i + 'th field populated correctly.');
                });

                // test array item toolbar
                var firstField = $(inputFields[0]);
                $(firstField).hover(function() {
                    var $this  = $(this);
                    var bar    = $this.getArrayBar();
                    ok(bar.length, 'First item toolbar generated.');

                    var btns   = bar.find('button');
                    equal(btns.length, 4, 'Four buttons generated.');

                    // simulate add
                    var addBtn = btns.filter('[data-alpaca-array-actionbar-action="add"]');
                    ok(addBtn.length, 'Add button generated.');
                    addBtn.click(function() {
                        var newInputFields = el.find('input');
                        equal(newInputFields.length, data.length + 1, 'New input field generated.');

                        var newField = $(newInputFields.filter(function(i) {
                            return inputFields.filter('#' + $(this).attr('id')).length == 0;
                        })[0]);
                        equal(newField.val(), '', 'New input field populated correctly.');

                        // simulate remove
                        var removeBtn = $(el.find('[data-alpaca-array-actionbar-action="remove"]')[1]);
                        ok(removeBtn.length, 'Remove button generated.');
                        removeBtn.click(function() {
                            equal(el.find('input').length, data.length, 'New input removed correctly.');

                            // simulate up
                            var upBtn = $(el.find('[data-alpaca-array-actionbar-action="up"]').last());
                            ok(upBtn.length, 'Up button generated.');
                            upBtn.click(function() {
                                var first = el.find('input:text:eq(0)');
                                var last  = el.find('input:text:eq(2)');

                                equal(first.val(), data[0], 'First field value properly unchanged.');
                                equal(last.val(), data[data.length - 2], 'Last field value properly changed.');

                                // simulate down
                                var downBtn = $(el.find('[data-alpaca-array-actionbar-action="down"]')[0]);
                                ok(downBtn.length, 'Down button generated.');
                                downBtn.click(function() {
                                    var first = el.find('input:text:eq(0)');
                                    var last  = el.find('input:text:eq(2)');

                                    equal(first.val(), data[data.length - 1], 'First field value properly changed.');
                                    equal(last.val(), data[data.length - 2], 'Last field value properly changed.');

                                    start();
                                });
                                downBtn.click();
                            });
                            upBtn.click();
                        });
                        removeBtn.click();
                    });
                    addBtn.click();

                }, function() {
                    firstField.mouseenter();
                });

                firstField.mouseleave();
            }
        });
    });

    // Test case 2 : Array field with options and schema.
    test("Array field with options and schema", function() {
        stop();
        var el = $('#array-fixture');
        el.alpaca({
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
                var inputElem0 = el.find('input:text:eq(0)');
                ok(inputElem0.length, 'First text input field generated.');
                equal(inputElem0.val(), 'M', 'First input field value populated correctly.');

                var id = inputElem0.attr('id');
                var arrayHelperItem = el.find('.alpaca-helper');
                ok(arrayHelperItem.length, 'Array helper generated.');
                equal(arrayHelperItem.text().replace(/^\s+|\s+$/g, ''), 'Favorite Ice Cream', 'Array helper text populated correctly.');

                var item0LabelElem = el.find('label');
                ok(item0LabelElem.length, 'Item label generated.');
                equal(item0LabelElem.text(), 'Favorite 1', 'Item label text populated correctly.');

                var inputElem0LabelElem = el.find('#' + id + '-controlfield-label > div');
                ok(inputElem0LabelElem.length, 'Array item label generated.');
                equal(inputElem0LabelElem.text(), 'Ice Cream', 'Array item label text populated correctly.');
                var inputElem0MessageElem = el.find('#' + id + '-field-message-0 > .alpaca-controlfield-message-text');
                ok(inputElem0MessageElem.length, 'Array item invalid message generated.');
                equal(inputElem0MessageElem.text(), Alpaca.substituteTokens(renderedField.view.getMessage("stringTooShort"), [3]), 'Array item invalid text populated correctly.');
                var arrayElem = el.find('fieldset.alpaca-field-invalid');
                ok(arrayElem.length, 'Array marked as invalid.');
                var arrayId = arrayElem.attr('alpaca-field-id');
                var arrayMessageElem = el.find('#' + arrayId + '-field-message-0 > .alpaca-controlfield-message-text');
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
                        var newInputElem = el.find('input:text:eq(1)');
                        ok(newInputElem.length, 'New text input field generated.');
                        //equal(newInputElem.val(), 'M', 'New input field value populated correctly.');
                        // new elements populate with empty value
                        equal(newInputElem.val(), '', 'New input field value populated correctly.');
                        var arrayMessageElem = el.find('#' + arrayId + '-field-message-0');
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
                simulateClick(arrayToolBarAddButton, function() {

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

                    simulateClick(arrayItemToolBarRemoveButton, function() {

                        arrayToolBarAddButton = $('#array-5 .alpaca-fieldset-array-toolbar-add');
                        ok(arrayToolBarAddButton.length, 'Array toolbar re-generated once all items are removed.');

                        start();
                    });
                });
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
