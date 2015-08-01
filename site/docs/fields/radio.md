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
from the list of available options.  In addition, the ```vertical``` option is specified to inform
the field to render vertically.

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
        "vertical": true
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