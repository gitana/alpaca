(function($) {

    module("forms: edit", {
        setup: function() {
            $("#qunit-fixture").append('<div id="editform-1"></div>');
            $("#qunit-fixture").append('<div id="editform-2"></div>');
        },
        teardown: function() {
            $("#editform-1").remove();
            $("#editform-2").remove();
        }
    });

    // Test case 1 : Edit form with readonly fields.
    test("Edit form with readonly fields.", function() {
        stop();
        $("#editform-1").alpaca({
            "dataSource": "../examples/forms/customer-profile/data.json",
            "optionsSource": "../examples/forms/customer-profile/simple-options.json",
            "schemaSource": "../examples/forms/customer-profile/schema.json",
            "view": {
                "parent": "VIEW_WEB_EDIT",
                "displayReadonly": true
            },
            "postRender": function (renderedField) {
                expect(4);
                equal($('#editform-1 input[type="text"][readonly], #editform-1 input[type="number"][readonly]').length, 6, 'Right number of readonly text input fields rendered.');
                // this was 3 but it's now 2 since we set to required
                equal($('#editform-1 input[type="radio"][readonly]').length, 2, 'Right number of readonly radio input fields rendered.');
                equal($('#editform-1 select[readonly]').length, 1, 'Right number of readonly select input fields rendered.');
                equal($('#editform-2 .alpaca-controlfield:hidden').length, 0, 'No hidden field.');
                start();
            }
        });
    });

    // Test case 2 : Simple form for editing content.
    test("Simple form for editing content.", function() {
        stop();
        $("#editform-2").alpaca({
            "dataSource": "../examples/forms/customer-profile/data.json",
            "optionsSource": "../examples/forms/customer-profile/simple-options.json",
            "schemaSource": "../examples/forms/customer-profile/schema.json",
            "view": {
                "parent": "VIEW_JQUERYUI_EDIT",
                "displayReadonly": false
            },
            "postRender": function (renderedField) {
                expect(1);
                var textInputElems = $('#editform-2 .alpaca-controlfield').filter(function() {
                    return $(this).css('display') !== 'none';
                });
                equal(textInputElems.length, 2, 'Right number of input fields are shown.');
                start();
            }
        });
    });

}(jQuery) );