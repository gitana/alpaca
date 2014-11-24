---
layout: documentation-field
title: Upper Case Field
header: Upper Case Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```uppercase``` field.

<!-- INCLUDE_API_DOCS: uppercase -->


## Example 1
The upper case field will automatically format any input to upper-case.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is wonderful!",
    "schema": {
        "format": "uppercase"
    }
});
</script>
{% endraw %}


## Example 2
This example uses a display-only view to show the value.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Ice cream is wonderful!",
    "schema": {
        "format": "uppercase"
    },
    "options": {
        "label": "Attention"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}