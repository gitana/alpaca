---
layout: documentation-field
title: Forms
header: Forms
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca lets you wrap a standard HTML form binding around your rendered fields to support both direct HTML submits
and Ajax, behind-the-scenes submits.  You can pass form configuration into the Alpaca engine to control the POST
itself and also to bind buttons to the screen for the user to submit the form.

If you're interested in multi-step forms, take a look at the section on <a href="wizards.html">wizards</a> which
describes how you can split fields across multiple pages in a form.  You can then capture the data at the end
and submit it to your HTTP handler.

## Simple Example

Here is a simple registration form that adds a submit button.  We handle the click to just show the generated JSON.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "firstName": {
                "title": "First Name",
                "type": "string"
            },
            "lastName": {
                "title": "Last Name",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minValue": 0,
                "maxValue": 100
            }
        }
    },
    "options": {
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        var value = this.getValue();
                        alert(JSON.stringify(value, null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## POSTing to an echo handler

Here is an example where we post to an echo handler.  Nothing too crazy.  The POST happens in the browser and so the
browser is redirected to the POST handler's page.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "firstName": {
                "title": "First Name",
                "type": "string"
            },
            "lastName": {
                "title": "Last Name",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minValue": 0,
                "maxValue": 100
            }
        }
    },
    "options": {
        "form": {
            "attributes": {
                "method": "post",
                "action": "http://httpbin.org/post"
            },
            "buttons": {
                "submit": {
                    "title": "Bring it on!"
                }
            }
        }
    }
});
</script>
{% endraw %}


## AJAX POST

And here is another example where we do a background AJAX POST.  This lets us stay on the same page while submitting
the POST data in the background.  To do this, we register a manual click handler and programmatically fire off the
submit.  Note that the <code>ajaxSubmit</code> method hands back a jQuery promise.  We can use that to conditionally
make decisions on what to do next if we want to.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "firstName": {
                "title": "First Name",
                "type": "string"
            },
            "lastName": {
                "title": "Last Name",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minValue": 0,
                "maxValue": 100
            }
        }
    },
    "options": {
        "form": {
            "attributes": {
                "method": "post",
                "action": "http://httpbin.org/post"
            },
            "buttons": {
                "submit": {
                    "title": "Bring it on!",
                    "click": function(e) {
                        var promise = this.ajaxSubmit();
                        promise.done(function() {
                            alert("Success");
                        });
                        promise.fail(function() {
                            alert("Error");
                        });
                        promise.always(function() {
                            //alert("Completed");
                        });
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}


## POSTing to an echo handler

Here is an example where we post to an echo handler.  Nothing too crazy.  The POST happens in the browser and so the
browser is redirected to the POST handler's page.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "schema": {
        "title": "Your Information",
        "type": "object",
        "properties": {
            "firstName": {
                "title": "First Name",
                "type": "string"
            },
            "lastName": {
                "title": "Last Name",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "integer",
                "minValue": 0,
                "maxValue": 100
            }
        }
    },
    "options": {
        "form": {
            "attributes": {
                "method": "post",
                "action": "http://httpbin.org/post"
            },
            "buttons": {
                "submit": {
                    "title": "Bring it on!"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Form with Buttons

Here is an example of a form with a submit and reset button.

<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data" : {
        "name" : "John McClane",
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
                "enum" : ['excellent','ok','rocks'],
                "required" : true
            }
        }
    },
    "options" : {
        "form":{
            "attributes":{
                "action":"http://httpbin.org/post",
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
    }
});
</script>
{% endraw %}
