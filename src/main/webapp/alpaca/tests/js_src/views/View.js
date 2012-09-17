(function($) {

    module("views: views");

    // Test case 1 : View with custom field-level templates and messages.
    test("View with custom field-level templates and messages.", function() {
        stop();
        $("#view-1").alpaca({
            "data": "Vanilla",
            "options": {
                "label": "Ice Cream",
                "helper": "Your favorite ice cream?",
                "size": 10
            },
            "schema": {
                "maxLength": 5
            },
            "view": {
                "type": "edit",
                "templates": {
                    "controlFieldOuterEl": '<span class="alpaca-field" id="${outerElId}"><div>Alpaca Farm Survey</div>{{html this.html}}</span>',
                    "controlFieldHelper": '{{if options.helper}}<span class="{{if options.helperClass}}${options.helperClass}{{/if}}" id="${helperId}">${options.helper}</span>{{/if}}'
                },
                "messages": {
                    "stringTooLong": "Input Maximum length {0}"
                }
            },
            "postRender": function (renderedField) {
                expect(5);
                var headerElem = $('#view-1 > span > div:eq(0)');
                equal(headerElem.text(), 'Alpaca Farm Survey', 'Custom field header rendered correctly.');
                var helperElem = $('#view-1 .alpaca-controlfield-container span:.alpaca-controlfield-helper');
                equal(helperElem.text(), 'Your favorite ice cream?', 'Custom template for helper rendered correctly.');
                var invalidElem = $('#view-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#view-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), 'Input Maximum length 5', 'Custom error message text populated correctly.');
                start();
            }
        });
    });

    // Test case 2 : Web display view.
    test("Web display view.", function() {
        stop();
        $("#view-2").alpaca({
            "data": "Alpaca Farm Offers Best Home Made Ice Cream!",
            "render": function(field, postRenderCallback) {
                field.render('VIEW_WEB_DISPLAY');
                postRenderCallback(field);
            },
            "postRender": function (renderedField) {
                expect(2);
                var dataElem = $('#view-2 .alpaca-data');
                ok(dataElem.length, "Data field for display view rendered.")
                equal(dataElem.text().trim(), 'Alpaca Farm Offers Best Home Made Ice Cream!', 'Text for display view data field rendered correctly.');
                start();
            }
        });
    });

    // Test case 3 : Global view template.
    test("Global view template.", function() {
        stop();
        $("#view-3").alpaca({
            "data": "Alpaca Farm Offers Best Home Made Ice Cream!",
            "view": {
                "globalTemplate": '<div>Our Tagline: ${data}</div>'
            },
            "postRender": function (renderedField) {
                expect(2);
                var dataElem = $('#view-3 div');
                ok(dataElem.length, "Custom global view template rendered.")
                equal(dataElem.text().trim(), 'Our Tagline: Alpaca Farm Offers Best Home Made Ice Cream!', 'Text for custom global view template rendered correctly.');
                start();
            }
        });
    });

    // Test case 4 : Global view template loaded through ajax call.
    test("Global view template loaded through ajax call.", function() {
        stop();
        $("#view-4").alpaca({
            "data": '../examples/fields/views/view-data.json',
            "options": {
                "label": "History Of Alpaca Farm",
                "helper": "Family Owned Business Since 1996!"
            },
            "view": {
                "globalTemplate": '../examples/fields/views/view-template.html'
            },
            "postRender": function (renderedField) {
                expect(6);
                var titleElem = $('#view-4 h2');
                ok(titleElem.length, "Title field for custom global view template rendered.")
                equal(titleElem.text().trim(), 'Alpaca Farm History', 'Text for custom global view template title field rendered correctly.');
                var subTitleElem = $('#view-4 h3');
                ok(subTitleElem.length, "Sub-title field for custom global view template rendered.")
                equal(subTitleElem.text().trim(), 'History Of Alpaca Farm', 'Text for custom global view template sub-title field rendered correctly.');
                var bodyElem = $('#view-4 h4');
                ok(bodyElem.length, "Body field for custom global view template rendered.")
                equal(bodyElem.text().trim(), 'Famous since 1839 for our legendary ice cream, Alpaca Farm has become the perfect place for the whole family to visit, have fun and relax.',
                        'Text for custom global view template body field rendered correctly.');
                start();
            }
        });
    });

}(jQuery) );