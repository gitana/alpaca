---
layout: documentation-field
title: Number Field
header: Number Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```number``` field.

<!-- INCLUDE_API_DOCS: number -->


## Example 1
Number field with only data parameter.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": 15.01
});
</script>
{% endraw %}


## Example 2
Number field with value range defined by minimum and maximum schema property.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": 3.55,
    "options": {
        "label": "Gas Price:",
        "helper": "Enter Gas Price in Your Neighborhood",
        "size": 5
    },
    "schema": {
        "minimum": 2.10,
        "maximum": 3.25
    }
});
</script>
{% endraw %}


## Example 3
Number field with exclusiveMinimum and exclusiveMaximum schema property.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": 21.5,
    "options": {
        "label": "Facebook Stock Price",
        "helper": "Enter your predicted facebook stock price in 6 months."
    },
    "schema": {
        "minimum": 10.2,
        "maximum": 21.5,
        "exclusiveMinimum": true,
        "exclusiveMaximum": true
    }
});
</script>
{% endraw %}


## Example 4
Number field with rendered in display-only mode.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": 15.01,
    "view": "bootstrap-display",
    "options": {
        "label": "The survey says"
    }
});
</script>
{% endraw %}

## Example 5
Form using number fields to represent geolocation latitude and longitude.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
    "data": {
        "latitude": 0,
        "longitude": 0
    },
    "schema": {
        "type": "object",
        "properties": {
            "latitude": {
                "minimum": -180,
                "maximum": 180,
                "title": "Latitude",
                "required": true
            },
            "longitude": {
                "minimum": -180,
                "maximum": 180,
                "title": "Longitude",
                "required": true
            }
        }
    },
    "options": {
        "fields": {
            "latitude": {
                "type": "number"
            },
            "longitude": {
                "type": "number"
            }
        }
    }
});
</script>
{% endraw %}

## Example 6
An example that uses `multipleOf`.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
    "schema": {
        "type": "number",
        "multipleOf": 1
    }
});
</script>
{% endraw %}
