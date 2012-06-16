(function($) {

    module("connectors: simple");

    // Test case 1 : Simple connector.
    test("Simple connector.", function() {
        stop();

        var connector = new Alpaca.Connectors.SimpleConnector('simple', {
            "root": "../examples/fields/connectors/simple"
        });
        connector.connect(function (success) {
            $("#simple-1").alpaca({
                "data": "betty_icecream_lover",
                "options": "edit",
                "schema": "profile",
                "view": "custom_web",
                "connector": connector,
                "render": function(field, postRenderCallback) {
                    field.options.fields.address.postRender = function(renderedField) {
                        var topLayoutRightColumnElem = $('#simple-1 form > div > div > div.alpaca-layout-two-column-right');
                        ok(topLayoutRightColumnElem.length, 'Top layout right column rendered correctly.');
                        var fieldLayoutLeftColumnElem = $('.alpaca-layout-two-column-left', topLayoutRightColumnElem);
                        ok(fieldLayoutLeftColumnElem.length, 'Address field layout left column rendered correctly.');
                        var fieldLayoutRightColumnElem = $('.alpaca-layout-two-column-right', topLayoutRightColumnElem);
                        ok(fieldLayoutRightColumnElem.length, 'Address field layout right column rendered correctly.');
                        start();
                    };
                    field.render();
                    postRenderCallback(field);
                },
                "postRender": function (renderedField) {
                    expect(12);
                    var formElem = $('#simple-1 form');
                    ok(formElem.length, 'Form generated.');
                    equal(formElem.attr('action'), '/endpoint', 'Form field action attribute populated correctly.');
                    equal(formElem.attr('method'), 'post', 'Form field method attribute populated correctly.');
                    var submitButtonElem = $('#simple-1 form button:submit');
                    ok(submitButtonElem.length, 'Submit button generated.');
                    var resetButtonElem = $('#simple-1 form button:reset');
                    ok(resetButtonElem.length, 'Reset button generated.');
                    var printScreenButtonElem = $('#simple-1 form button[value="Print Screen"]');
                    ok(printScreenButtonElem.length, 'Print screen button generated.');
                    var reloadButtonElem = $('#simple-1 form button[value="Reload"]');
                    ok(reloadButtonElem.length, 'Reload button generated.');
                    var switchViewButtonElem = $('#simple-1 form button[value="Switch View"]');
                    ok(switchViewButtonElem.length, 'Switch view button generated.');
                    var topLayoutLeftColumnElem = $('div > div > div.alpaca-layout-two-column-left', formElem);
                    ok(topLayoutLeftColumnElem.length, 'Top layout left column rendered correctly.');
                }
            })
        });
    });

}(jQuery) );