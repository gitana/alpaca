---
layout: documentation-field
title: Hidden Field
header: Hidden Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```hidden``` field.

<!-- INCLUDE_API_DOCS: hidden -->


## Example 1: Form with Hidden Field
This example renders a form with a hidden <code>token</code> field.  When the form
submits, we extract the token value and print it out.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "password": {
                "type": "string"
            },
            "token": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "text",
                "label": "Username"
            },
            "password": {
                "type": "password",
                "label": "Password"
            },
            "token": {
                "type": "hidden"
            }
        },
        "form":{
            "buttons":{
                "submit":{
                    "value": "Log In"
                }
            }
        }
    },
    "data": {
        "token": "12345"
    },
    "postRender": function(control) {
        var form = control.form;
        form.registerSubmitHandler(function() {
            alert("Token is: " + control.getValue().token);
        });
    }
});
</script>
{% endraw %}