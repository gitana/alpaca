$(document).ready(function() {

    $('#form2').alpaca({
        "schema" : {
            "title" : "User Feedback",
            "description" : "What do you think about Alpaca?",
            "type" : "object",
            "properties" : {
                "name" : {
                    "type" : "string",
                    "title" : "Name"
                },
                "feedback" : {
                    "type" : "string",
                    "title" : "Feedback"
                },
                "ranking" : {
                    "type" : "string",
                    "title" : "Ranking",
                    "enum" : ['excellent','ok','so so']
                }
            }
        }
    });

    $('#form3').alpaca({
        "schema" : {
            "title" : "User Feedback",
            "description" : "What do you think about Alpaca?",
            "type" : "object",
            "properties" : {
                "name" : {
                    "type" : "string",
                    "title" : "Name"
                },
                "feedback" : {
                    "type" : "string",
                    "title" : "Feedback"
                },
                "ranking" : {
                    "type" : "string",
                    "title" : "Ranking",
                    "enum" : ['excellent','ok','so so']
                }
            }
        },
        "options" : {
            "helper" : "Tell us what you think about Alpaca!",
            "fields" : {
                "name" : {
                    "size" : 20,
                    "helper" : "Please enter your name.",
                    "placeholder": "Enter your name"
                },
                "feedback" : {
                    "type" : "textarea",
                    "rows" : 5,
                    "cols" : 40,
                    "helper" : "Please enter your feedback."
                },
                "ranking" : {
                    "type" : "select",
                    "helper" : "Select your ranking.",
                    "optionLabels" : ["Awesome!","It's Ok","Hmm..."]
                }
            }
        }
    });

    $('#form4').alpaca({
        "data" : {
            "name" : "Diego Maradona",
            "feedback" : "Very impressive.",
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
                    "action":"examples/endpoints/save.php",
                    "method":"post"
                },
                "buttons":{
                    "submit":{}
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
        "view" : "bootstrap-edit"
    });

    $('#form5').alpaca({
        "data" : {
            "name" : "Diego Maradona",
            "feedback" : "Very impressive.",
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
        "postRender": function(renderedForm) {
            $('#form4-button').click(function() {
                if (renderedForm.isValid(true)) {
                    var val = renderedForm.getValue();
                    $.ajax({
                        type: "POST",
                        url: "examples/endpoints/save2.php",
                        data: {json:JSON.stringify(val)},
                        success: function(msg) {
                            alert("Request received: " + msg);
                        }
                    });
                }
            });
        }
    });

});