---
layout: documentation-field
title: Integer Field
header: Integer Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```integer``` field.

<!-- INCLUDE_API_DOCS: integer -->


## Example 1
Integer field with data,options and schema parameters.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "data": 17,
        "options": {
            "type": "integer",
            "label": "Age:",
            "helper": "Guess Taylor Swift's Age"
        },
        "schema": {
            "minimum": 18,
            "maximum": 25,
            "exclusiveMinimum": true,
            "exclusiveMaximum": true,
            "divisibleBy": 2
        }
    });
</script>
{% endraw %}


## Example 2
Integer field with jQuery UI slider control.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": 18,
    "options": {
        "type": "integer",
        "label": "Snow Days:",
        "helper": "Number of Snow Days in January 2011",
        "slider": true
    },
    "schema": {
        "minimum": 1,
        "maximum": 31
    }
});
</script>
{% endraw %}


## Example 3
Integer field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": 17,
    "options": {
        "type": "integer",
        "label": "Age:",
        "helper": "Guess Taylor Swift's Age"
    },
    "schema": {
        "minimum": 18,
        "maximum": 25,
        "exclusiveMinimum": true,
        "exclusiveMaximum": true,
        "divisibleBy": 2
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 4
Integer fields with default values.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "schema": {
        "type": "object",
        "properties": {
            "first": {
                "type": "number",
                "default": 1
            },
            "second": {
                "type": "number",
                "default": 2
            },
            "third": {
                "type": "number",
                "default": 3
            }
        }
    },
    "options": {
        "fields": {
            "first": {
                "type": "integer",
                "label": "First Integer"
            },
            "second": {
                "type": "integer",
                "label": "Second Integer"
            },
            "third": {
                "type": "integer",
                "label": "Third Integer"
            }
        }
    }
});
</script>
{% endraw %}