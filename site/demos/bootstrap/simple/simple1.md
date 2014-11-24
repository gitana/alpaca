---
layout: demo
title: Registration Form with Automatic Validation
header: Registration Form with Automatic Validation
framework: Twitter Bootstrap
---

Here is a very simple example of a three-field registration form.  The submit button is not available until
all of the fields have been filled in and are in a valid state.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "view": "bootstrap-create",
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "required": true
            },
            "birthday": {
                "type": "text",
                "format": "date",
                "required": true
            },
            "preference": {
                "type": "text",
                "enum": ["orlando", "tokyo", "amsterdam"],
                "default": "orlando",
                "required": true
            }
        }
    },
    "options": {
        "form": {
            "buttons": {
                "submit":{}
            }
        },
        "fields": {
            "name": {
                "label": "Your Name"
            },
            "birthday": {
                "label": "Your Birthday"
            },
            "preference": {
                "label": "Your Destination",
                "type": "select",
                "optionLabels": ["Orlando, USA", "Tokyo, Japan", "Amsterdam, Netherlands"]
            }
        }
    }
});
</script>
{% endraw %}