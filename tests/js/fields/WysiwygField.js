(function($) {

    module("fields: wysiwyg");

    // Test case 1 : Wysiwyg editor.
    test("Wysiwyg editor.", function() {
        stop();
        var data = "Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.";
        $("#wysiwyg-1").alpaca({
            "data": data,
            "options": {
                "type": "wysiwyg"
            },
            "postRender": function (renderedField) {
                expect(2);
                equal(renderedField.getValue(), data, 'Wysiwyg editor getValue() method returns correct value.');
                var inputElem = $('#wysiwyg-1 .wysiwyg');
                equal(inputElem.length, 1, 'Wysiwyg editor field generated.');
                start();
            }
        });
    });

}(jQuery) );