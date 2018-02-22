---
layout: documentation-field
title: Radio Field
header: Radio Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```radio``` field.

<!-- INCLUDE_API_DOCS: radio -->


## Example 1
Radio button field with data, options and schema parameters. As default, radio group field will be rendered if schema enum properties has 3 or less options.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Coffee",
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?"
    },
    "schema": {
        "enum": ["Vanilla", "Chocolate", "Coffee"]
    }
});
</script>
{% endraw %}


## Example 2
Required radio button field with option labels.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Coffee2",
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
        "optionLabels": ["Vanilla Flavor", "Chocolate Flavor", "Coffee Flavor"]
    },
    "schema": {
        "required": true,
        "enum": ["Vanilla", "Chocolate", "Coffee"]
    }
});
</script>
{% endraw %}


## Example 3
Radio button field with more than 3 options and custom option labels.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "green",
    "options": {
        "type" : "radio",
        "label": "Favorite Color",
        "helper": "Pick your favorite color",
        "optionLabels": {
            "red" : "Red",
            "green" : "Green",
            "blue" : "Blue",
            "white" : "White",
            "black" : "Black"
        }
    },
    "schema": {
        "required": true,
        "enum": ["red", "green", "blue","white","black"]
    }
});
</script>
{% endraw %}


## Example 4
Radio button in display-only mode.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "Coffee",
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?"
    },
    "schema": {
        "enum": ["Vanilla", "Chocolate", "Coffee"]
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 5
A radio field that uses the ```removeDefaultNone``` option to remove the option for the end user to select ```None```
from the list of available options.  In addition, the ```vertical``` option is set to ```false`` specified to inform
the field to render horizontally.  If not specified, ```vertical``` is assumed to be true.

Note that if the property that the field describes is required for data integrity to be maintained,
consider setting the property schema's <code>required</code> setting to <code>true</code>.
This produces the same effect and also allows your data to validate appropriately.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "Jimi Hendrix",
    "schema": {
        "enum": [
            "Jimi Hendrix",
            "Mark Knopfler",
            "Joe Satriani",
            "Eddie Van Halen",
            "Orianthi"
        ]
    },
    "options": {
        "type": "radio",
        "label": "Who is your favorite guitarist?",
        "removeDefaultNone": true,
        "vertical": false
    }
});
</script>
{% endraw %}

## Example 6
A radio field with disabled values.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "data": "Jimi Hendrix",
    "schema": {
        "enum": [
            "Jimi Hendrix",
            "Mark Knopfler",
            "Joe Satriani",
            "Eddie Van Halen",
            "Orianthi"
        ]
    },
    "options": {
        "type": "radio",
        "label": "Who is your favorite guitarist?",
        "vertical": true,
        "disabled": true
    }
});
</script>
{% endraw %}


## Example 7
An example of a radio button field mounted on top of an array of strings.  Note a radio group only allows for a single
selection and so the maximum size of the array will be 1.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "schema": {
        "type": "array",
        "items": {
            "type": "string"
        },
        "enum": ["Vanilla", "Chocolate", "Coffee"]
    },
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
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
    "data": ["Coffee"]
});
</script>
{% endraw %}


## Example 8
An example of a radio button field that loads its values from a data source.
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
$("#field8").alpaca({
    "schema": {
        "type": "string"
    },
    "options": {
        "label": "Select your favorite flavor of ice cream",
        "type": "radio",
        "dataSource": "/data/icecream-list.json",
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
    }
});
</script>
{% endraw %}


## Example 9
Example that sets value after render.
<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "schema": {
        "enum": ["Vanilla", "Chocolate", "Coffee"]
    },
    "options": {
        "label": "Ice cream",
        "helper": "Guess my favorite ice cream?",
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
    "postRender": function(control) {
        control.setValue("Coffee");
    }
});
</script>
{% endraw %}


