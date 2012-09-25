(function($) {

    module("fields: file");

    // Test case 1 : File field.
    test("File field.", function() {
        stop();
        var data = "Ice cream or ice-cream is a frozen dessert usually made from dairy products, such as milk and cream, and often combined with fruits or other ingredients and flavours.";
        $("#file-1").alpaca({
            "data": "",
            "options": {
                "type": "file",
                "label": "Ice Cream Photo:",
                "helper": "Pick your favorite ice cream picture."
            },
            "postRender": function (renderedField) {
                expect(5);
                var inputElem = $('#file-1 input:file');
                ok(inputElem.length, 'File input field generated.');
                var labelElem = $('#file-1 .alpaca-controlfield-label>div');
                ok(labelElem.length, 'Input field label generated.');
                equal(labelElem.text(), 'Ice Cream Photo:', 'Label text populated correctly.');
                var helperElem = $('#file-1 .alpaca-controlfield-helper > span.alpaca-controlfield-helper-text');
                ok(helperElem.length, 'Input field helper generated.');
                equal(helperElem.text(), 'Pick your favorite ice cream picture.', 'Helper text populated correctly.');
                start();
            }
        });
    });

}(jQuery) );