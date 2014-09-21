(function($) {

    module("fields: form and buttons");

    // Test case 1 : Form and Buttons.
    test("Form and buttons.", function() {
        stop();
        $("#form-1").alpaca({
            "data" : {
                "name" : "Britney Spears",
                "feedback" : "Alpaca is very cute.",
                "ranking" : "excellent"
            },
            "schema" : {
                "title" : "User Feedback",
                "description" : "What do you think about Alpaca?",
                "type" : "object",
                "properties" : {
                    "name" : {
                        "type" : "string",
                        "title" : "Name",
                        "required" : true
                    },
                    "feedback" : {
                        "type" : "string",
                        "title" : "Feedback"
                    },
                    "ranking" : {
                        "type" : "string",
                        "title" : "Ranking",
                        "enum" : ['excellent','ok','so so'],
                        "required" : true
                    }
                }
            },
            "options" : {
                "form":{
                    "attributes":{
                        "action":"../../endpoints/save.php",
                        "method":"post"
                    },
                    "buttons":{
                        "submit":{},
                        "reset":{}
                    }
                },
                "fields" : {
                    "helper" : "Tell us what you think about Alpaca!",
                    "name" : {
                        "size" : 20,
                        "helper" : "Please enter your name."
                    },
                    "feedback" : {
                        "type" : "textarea",
                        "name" : "your_feedback",
                        "rows" : 5,
                        "cols" : 30,
                        "helper" : "Please enter your feedback."
                    },
                    "ranking" : {
                        "type" : "select",
                        "helper" : "Select your ranking.",
                        "optionLabels" : ["Awesome!","It's Ok","Hmm..."]
                    }
                }
            },
            "postRender": function (renderedField) {
                expect(5);
                var formElem = $('#form-1 form');
                ok(formElem.length, 'Form generated.');
                equal(formElem.attr('action'), '../../endpoints/save.php', 'Form field action attribute populated correctly.');
                equal(formElem.attr('method'), 'post', 'Form field method attribute populated correctly.');
                var submitButtonElem = $('#form-1 form button:submit');
                ok(submitButtonElem.length, 'Submit button generated.');
                var resetButtonElem = $('#form-1 form button:reset');
                ok(resetButtonElem.length, 'Reset button generated.');
                start();
            }
        });
    });

}(jQuery) );