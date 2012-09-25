(function($) {

    module("fields: textarea");

    // Test case 1 : Textarea field with options.
    test("Textarea field with options.", function() {
        stop();
        var data = "Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.";
        $("#textarea-1").alpaca({
            "data": data,
            "options": {
                "type": "textarea",
                "label": "Receipt",
                "helper": "Receipt for Best Homemade Ice Cream",
                "rows": 6,
                "cols": 80
            },
            "postRender": function (renderedField) {
                expect(5);
                equal(renderedField.getValue(), data, 'Textarea field getValue() method returns correct value.');
                var inputElem = $('#textarea-1 textarea');
                ok(inputElem.length, 'Textarea input field generated.');
                equal(inputElem.val(), data, "Textarea input field value populated correctly.");
                equals(inputElem.attr('cols'),80, 'Textarea has right number of columns.')
                equals(inputElem.attr('rows'),6, 'Textarea has right number of rows.')
                start();
            }
        });
    });

}(jQuery) );