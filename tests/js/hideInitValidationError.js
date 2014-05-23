(function($) {

    module("validation: hideInitValidationError", {
        setup: function() {
            $("#qunit-fixture").append('<div id="hide-init-validation-error-fixture"></div>');
        },
        teardown: function() {
            $('#hide-init-validation-error-fixture').remove();
        }
    });

    test('hideInitValidationError still runs initial validation', function() {
        expect(1);
        stop();
        var el = $('#hide-init-validation-error-fixture');
        el.alpaca({
            schema: {
                type: 'object',
                properties: {
                    foo: {
                        type: 'string',
                        required: true
                    }
                }
            },
            options: {
                fields: {
                    foo: {
                        hideInitValidationError: true,
                        type: 'textarea'
                    }
                }
            },
            postRender: function(fields) {
                ok(!fields.isValid(true), 'Initial validation should have ran.');
                start();
            }
        });
    });

})(jQuery);
