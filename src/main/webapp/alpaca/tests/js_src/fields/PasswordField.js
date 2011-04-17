(function($) {

    module("fields: password");

    // Test case 1 : Password field.
    test("Password field.", function() {
        stop();
        $("#password-1").alpaca({
            "data": "password",
            "schema": {
                "format": "password"
            },
            "postRender": function (renderedField) {
                expect(3);
                equal(renderedField.getValue(), "password", 'Password field getValue() method returns correct value.');
                var inputElem = $('#password-1 input:password');
                ok(inputElem.length, 'Password input field generated.');
                equal(inputElem.val(), "password", "Password input field value populated correctly.");
                start();
            }
        });
    });

}(jQuery) );