$(document).ready(function() {

    $("#form2").alpaca({
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

    $("#form3").alpaca({
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
            },
            "focus": false
        }
    });

    $("#form4").alpaca({
        "data": {
            "name": "Diego Maradona",
            "feedback": "Very impressive.",
            "ranking": "excellent"
        },
        "schema": {
            "title":"User Feedback",
            "description":"What do you think about Alpaca?",
            "type":"object",
            "properties": {
                "name": {
                    "type":"string",
                    "title":"Name",
                    "required":true
                },
                "feedback": {
                    "type":"string",
                    "title":"Feedback"
                },
                "ranking": {
                    "type":"string",
                    "title":"Ranking",
                    "enum":['excellent','ok','so so'],
                    "required":true
                }
            }
        },
        "options": {
            "form":{
                "attributes":{
                    "action":"http://httpbin.org/post",
                    "method":"post"
                },
                "buttons":{
                    "submit":{}
                }
            },
            "helper": "Tell us what you think about Alpaca!",
            "fields": {
                "name": {
                    "size": 20,
                    "helper": "Please enter your name."
                },
                "feedback" : {
                    "type": "textarea",
                    "name": "your_feedback",
                    "rows": 5,
                    "cols": 40,
                    "helper": "Please enter your feedback."
                },
                "ranking": {
                    "type": "select",
                    "helper": "Select your ranking.",
                    "optionLabels": ["Awesome!",
                        "It's Ok",
                        "Hmm..."]
                }
            },
            "focus": false
        },
        "view" : "bootstrap-edit"
    });

    $("#form5").alpaca({
        "data": {
            "name": "Diego Maradona",
            "feedback": "Very impressive.",
            "ranking": "excellent"
        },
        "schema": {
            "title":"User Feedback",
            "description":"What do you think about Alpaca?",
            "type":"object",
            "properties": {
                "name": {
                    "type":"string",
                    "title":"Name",
                    "required":true
                },
                "feedback": {
                    "type":"string",
                    "title":"Feedback"
                },
                "ranking": {
                    "type":"string",
                    "title":"Ranking",
                    "enum":['excellent','ok','so so'],
                    "required":true
                }
            }
        },
        "options": {
            "form":{
                "attributes":{
                    "action":"http://httpbin.org/post",
                    "method":"post"
                },
                "buttons":{
                    "submit":{
                        "title": "Send Form Data",
                        "click": function() {
                            var val = this.getValue();
                            if (this.isValid(true)) {

                                alert("Valid value: " + JSON.stringify(val, null, "  "));
                                this.ajaxSubmit().done(function() {
                                    alert("Posted!");
                                });
                            } else {
                                alert("Invalid value: " + JSON.stringify(val, null, "  "));
                            }
                        }
                    }
                }
            },
            "helper": "Tell us what you think about Alpaca!",
            "fields": {
                "name": {
                    "size": 20,
                    "helper": "Please enter your name."
                },
                "feedback" : {
                    "type": "textarea",
                    "name": "your_feedback",
                    "rows": 5,
                    "cols": 40,
                    "helper": "Please enter your feedback."
                },
                "ranking": {
                    "type": "select",
                    "helper": "Select your ranking.",
                    "optionLabels": ["Awesome!",
                        "It's Ok",
                        "Hmm..."]
                }
            },
            "focus": false
        },
        "postRender": function(control) {
            control.childrenByPropertyId["name"].getFieldEl().css("background-color", "lightgreen");
        }
    });

});