---
layout: demo
title: Registration Form with Click Validation
header: Registration Form with Click Validation
framework: Twitter Bootstrap
---

This form expands the three-field registration form to include manual submit validation.  The state
of the submit button does not change as the values of the form are filled out.  However, once the
submit button is clicked, we manually handle some validation and take care of submitting the form
on our own.

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
                "required": true,
                "default": "orlando"
            }
        }
    },
    "options": {
        "form": {
            "buttons": {
                "submit":{}
            },
            "toggleSubmitValidState": false
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
    },
    "postRender": function(renderedField) {

        var form = renderedField.form;
        if (form) {
            form.registerSubmitHandler(function(e, form) {

                // validate the entire form (top control + all children)
                form.validate(true);

                // draw the validation state (top control + all children)
                form.refreshValidationState(true);

                // now display something
                if (form.isFormValid())
                {
                    var value = form.getValue();

                    alert("The form looks good!  Name: " + value.name + ", Birthday: " + value.birthday + ", Preference: " + value.preference);
                }
                else
                {
                    alert("There are problems with the form.  Please make the any necessary corrections.");
                }

                e.stopPropagation();

                return false;
            });
        }
    }
});
</script>
{% endraw %}