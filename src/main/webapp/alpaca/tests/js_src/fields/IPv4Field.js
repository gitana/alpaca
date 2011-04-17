(function($) {

    module("fields: ipv4");

    // Test case 1 : Upper case field.
    test("Upper case field.", function() {
        stop();
        $("#ipv4-1").alpaca({
            "data": "100.60",
            "schema": {
                "format": "ip-address"
            },
            "postRender": function (renderedField) {
                expect(7);
                equal(renderedField.getValue(), "100.60", 'IP address field getValue() method returns correct value.');
                var inputElem = $('#ipv4-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                equal(inputElem.val(), "100.60", "Text input field value populated correctly.");
                var invalidElem = $('#ipv4-1 .alpaca-field-invalid');
                ok(invalidElem.length, 'Input field marked as invalid.');
                var messageElem = $('#ipv4-1 .alpaca-controlfield-message-text');
                ok(messageElem.length, 'Field error message generated.');
                equal(messageElem.text(), renderedField.view.getMessage("invalidIPv4"), 'Error message text populated correctly.');
                // change the field value and trigger the field re-validation
                inputElem.blur(function() {
                    if (inputElem.val() == '192.168.0.1') {
                        var invalidElem = $('#ipv4-1 .alpaca-field-invalid');
                        ok(invalidElem.length==0, 'Input field marked as valid with value 192.168.0.1.');
                    }
                });
                inputElem.val('192.168.0.1');
                inputElem.blur();
                start();
            }
        });
    });

}(jQuery) );