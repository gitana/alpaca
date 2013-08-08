(function($) {

    module("forms: create");

    // Test case 1 : Form for creating new content.
    test("Form for creating new content.", function() {
        stop();
        $("#createform-1").alpaca({
            "optionsSource": "../examples/forms/customer-profile/options.json",
            "schemaSource": "../examples/forms/customer-profile/schema.json",
            "view": "VIEW_WEB_CREATE",
            "postRender": function (renderedField) {
                expect(13);
                var formElem = $('#createform-1 form');
                ok(formElem.length, 'Form generated.');
                equal(formElem.attr('action'), '../../endpoints/echo.php', 'Form field action attribute populated correctly.');
                equal(formElem.attr('method'), 'post', 'Form field method attribute populated correctly.');
                var textInputElems = $('#createform-1 input:text');
                equal(textInputElems.length, 5, 'Right number of text input fields rendered.');
                equal($('#createform-1 input:text:eq(0)').val(), '', 'Data not bounded for name text field.');
                equal($('#createform-1 input:text:eq(1)').val(), '', 'Data not bounded for age text field.');
                equal($('#createform-1 input:text:eq(2)').val(), '', 'Data not bounded for phone text field.');
                equal($('#createform-1 input:text:eq(3)').val(), '', 'Data not bounded for city text field.');
                equal($('#createform-1 input:text:eq(4)').val(), '', 'Data not bounded for zip text field.');
                //equal($('#createform-1 input:radio:checked').val(), '', 'Data not bounded for gender radio field.');
                // the radio should actually be unbound because we let it float on non-enum'd value, which is now supported
                equal(0, $('#createform-1 input:radio:checked').length, "Radio was allowed to float");
                equal($('#createform-1 select:eq(0) > option:selected').val(), '', 'Data not bounded for favorite select field.');
                equal($('#createform-1 select:eq(1) > option:selected').val(), '', 'Data not bounded for state select field.');
                var inputElem = $('#createform-1 input:checkbox');
                equal(inputElem.is(':checked'), false, 'Data not bounded for membership checkbox field.');
                start();
            }
        });
    });

    // Test case 2 : Simple form for creating new content.
    test("Simple form for creating new content.", function() {
        stop();
        $("#createform-2").alpaca({
            "optionsSource": "../examples/forms/customer-profile/simple-options.json",
            "schemaSource": "../examples/forms/customer-profile/schema.json",
            "view": "VIEW_WEB_CREATE",
            "postRender": function (renderedField) {
                expect(1);
                var textInputElems = $('#createform-2 span.alpaca-controlfield:visible');
                equal(textInputElems.length, 2, 'Right number of input fields are shown.');
                start();
            }
        });
    });

}(jQuery) );