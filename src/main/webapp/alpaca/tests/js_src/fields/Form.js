(function($) {

    module("fields: form and buttons");

    // Test case 1 : Form and Buttons.
    test("Form and buttons.", function() {
        stop();
        $("#form-1").alpaca({
            "data": "../examples/fields/form-controls/data.json",
            "options": "../examples/fields/form-controls/options.json",
            "schema": "../examples/fields/form-controls/schema.json",
            "postRender": function (renderedField) {
                expect(12);
                var formElem = $('#form-1 form');
                ok(formElem.length, 'Form generated.');
                equal(formElem.attr('action'), '/endpoint', 'Form field action attribute populated correctly.');
                equal(formElem.attr('method'), 'post', 'Form field method attribute populated correctly.');
                var submitButtonElem = $('#form-1 form button:submit');
                ok(submitButtonElem.length, 'Submit button generated.');
                var resetButtonElem = $('#form-1 form button:reset');
                ok(resetButtonElem.length, 'Reset button generated.');
                var printScreenButtonElem = $('#form-1 form button[value="Print Screen"]');
                ok(printScreenButtonElem.length, 'Print screen button generated.');
                var reloadButtonElem = $('#form-1 form button[value="Reload"]');
                ok(reloadButtonElem.length, 'Reload button generated.');
                var switchViewButtonElem = $('#form-1 form button[value="Switch View"]');
                ok(switchViewButtonElem.length, 'Switch view button generated.');
                var form = renderedField.form;
                $.each(form.buttons, function(index, button) {
                    if (button.type == 'reloadbutton') {
                        button.hide();
                    }
                });
                form.switchViewButton.hide();
                var reloadButtonContainerElem = $('#form-1 form .alpaca-form-buttons-container > span:eq(2)');
                equal(reloadButtonContainerElem.css('display'), 'none', 'Reload button hidden.');
                var switchViewButtonContainerElem = $('#form-1 form .alpaca-form-buttons-container > span:eq(1)');
                equal(switchViewButtonContainerElem.css('display'), 'none', 'Switch view button hidden.');

                var cityControl = renderedField.getControlByPath("address/city");
                equal(cityControl.getValue(), 'Burlington', 'Successfully get control for city field.');
                form.addButton({
                    "data" : "Custom Button",
                    "postRender" : function(buttonControl) {
                        buttonControl.field.button({
                            text: true,
                            icons: {
                                primary: "ui-icon-newwin"
                            }
                        });
                        var customButtonElem = $('#form-1 form button[value="Custom Button"]');
                        ok(customButtonElem.length, 'Custom button added.');
                        start();
                    }
                });
            }
        });
    });

}(jQuery) );