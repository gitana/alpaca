---
layout: documentation-field
title: Checkbox Field
header: Checkbox Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```checkbox``` field.

<!-- INCLUDE_API_DOCS: checkbox -->


## Example 1
Simple checkbox field for boolean data.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": false
});
</script>
{% endraw %}


## Example 2
Checkbox field with both field label and right label.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": true,
    "options": {
        "label": "Question:",
        "rightLabel": "Do you like Alpaca?"
    }
});
</script>
{% endraw %}


## Example 3
Simple checkbox field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": false,
    "view": "bootstrap-display",
    "options": {
        "label": "Registered?"
    }
});
</script>
{% endraw %}


## Example 4
Checkbox Field used for multiple values provided as an array.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": ["sandwich", "cookie", "drink"],
    "schema": {
        "type": "array",
        "enum": [
            "sandwich",
            "chips",
            "cookie",
            "drink"
        ]
    },
    "options": {
        "type": "checkbox",
        "label": "What would you like with your order?",
        "optionLabels": [
            "A Sandwich",
            "Potato Chips",
            "A Cookie",
            "Soft Drink"
        ]
    }
});
</script>
{% endraw %}


## Example 5
Checkbox Field used for multiple values provided as a comma-delimited string.
We also hook up some form buttons to get at the JSON.  Click the "View JSON" button to see it.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": "sandwich, cookie, drink",
    "schema": {
        "type": "string",
        "enum": [
            "sandwich",
            "chips",
            "cookie",
            "drink"
        ]
    },
    "options": {
        "type": "checkbox",
        "label": "What would you like with your order?",
        "optionLabels": [
            "A Sandwich",
            "Potato Chips",
            "A Cookie",
            "Soft Drink"
        ],
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