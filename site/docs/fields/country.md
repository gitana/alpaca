---
layout: documentation-field
title: Country Field
header: Country Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```country``` field.

<!-- INCLUDE_API_DOCS: country -->


## Example 1
Country field with default settings.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "options": {
        "type": "country"
    }
});
</script>
{% endraw %}


## Example 2
Country field with names capitalized.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "options": {
        "type": "country",
        "capitalize": true
    }
});
</script>
{% endraw %}


## Example 3
Country field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "usa",
    "options": {
        "type": "country",
        "label": "Country"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}

## Example 4
Object form with country field override to display mode.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": {
        "name": "John McClane",
        "age": 36,
        "country": "usa"
    },
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "age": {
                "type": "number"
            },
            "country": {
                "type": "string"
            }
        }
    },
    "options": {
        "fields": {
            "name": {
                "type": "text",
                "label": "Name"
            },
            "age": {
                "type": "integer",
                "label": "Age"
            },
            "country": {
                "type": "country",
                "label": "Country",
                "view": "bootstrap-display"
            }
        }
    }
});
</script>
{% endraw %}