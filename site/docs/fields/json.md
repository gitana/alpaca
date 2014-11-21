---
layout: documentation-field
title: JSON Field
header: JSON Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```json``` field.

<!-- INCLUDE_API_DOCS: json -->


## Example 1
JSON Editor field with valid json.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": {
        "properties" : {
            "text1" : "Text1",
            "text2" : "Text2"
        }
    },
    "options": {
        "type": "json",
        "rows": 12,
        "cols": 80
    }
});
</script>
{% endraw %}


## Example 2
JSON Editor field rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": {
        "properties" : {
            "text1" : "Text1",
            "text2" : "Text2"
        }
    },
    "options": {
        "type": "json",
        "rows": 12,
        "cols": 80,
        "label": "JSON"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}