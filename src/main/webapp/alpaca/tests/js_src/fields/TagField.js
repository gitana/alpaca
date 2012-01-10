(function($) {

    module("fields: tag");

    // Test case 1 : Upper case field.
    test("Tag field.", function() {
        stop();
        $("#tag-1").alpaca({
            "data": ["tag1","Tag2 "," tAg3"],
            "options": {
                "type": "tag"
            },
            "postRender": function (renderedField) {
                expect(5);
                var inputElem = $('#tag-1 input:text');
                ok(inputElem.length, 'Text input field generated.');
                inputElem.blur();
                same(renderedField.getValue(), ["tag1","tag2","tag3"], 'Tag field getValue() methods returns expected value.');
                equal(inputElem.val(), "tag1,tag2,tag3", "Text input field value populated correctly.");
                inputElem.val('new taG1, new TAG2, new tag3 ');
                inputElem.blur();
                equal(inputElem.val(), "new tag1,new tag2,new tag3", "Text input field value populated correctly after user input.");
                same(renderedField.getValue(), ["new tag1","new tag2","new tag3"], 'Tag field getValue() methods returns expected value.');
                start();
            }
        });
    });

}(jQuery) );