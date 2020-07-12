---
layout: documentation-field
title: ContentEditable Field
header: ContentEditable Field
group: navigation
---
{% include JB/setup %}


The ```contenteditable``` field is used to represent editable text within a form.

<!-- INCLUDE_API_DOCS: text -->

## Example 1
A simple example of using Alpaca with nothing more than a string of text.  Alpaca looks at your data and determines that it
is a string.  It then looks for a suitable candidate for representing a string and it decides to use the ```text``` field.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "contenteditable",
        "block": "paragraph"
    },
    "data": "I am serious.  And don't call me Shirley."
});
</script>
{% endraw %}

## Example 2
Here is a form that uses a template to render.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        name: "John Matrix",
        email: "commando@usaf.gov",
        age: 40,
        status: "retired"
    },
    "schema": {
        "title": "Customer Profile",
        "type": "object",
        "properties": {
            "name": {
                "title": "Full Name",
                "type": "string"
            },
            "email": {
                "title": "Email",
                "type": "string"
            },
            "age": {
                "title": "Age",
                "type": "number"
            },
            "status": {
                "title": "Status",
                "type": "string",
                "enum": [
                    "retired", 
                    "active"
                ]
            }            
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "contenteditable"
            },
            "email": {
                "type": "contenteditable"
            },
            "status": {
                "type": "select",
                "optionLabels": [
                    "Retired",
                    "Back in Action!"
                ],
                "hideNone": true
            }
        },
        "form": {
            "buttons": {
                "view": {
                    "label": "View JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }        
    },
    "view": {
        "layout": {
            "template": $("#template5").outerHTML()
        }
    }
});
</script>
{% endraw %}


<script type="text/x-handlebars-template" id="template5">
    <div>
        <div class="row">
            <div class="col-md-12">
                <div data-alpaca-layout-binding="name"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div data-alpaca-layout-binding="email"></div>
                <div data-alpaca-layout-binding="age"></div>
            </div>
            <div class="col-md-6">
                <div data-alpaca-layout-binding="status"></div>
            </div>
        </div>
    </div>
</script>
