---
layout: documentation-field
title: Lower Case Field
header: Lower Case Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```lowercase``` field.

<!-- INCLUDE_API_DOCS: lowercase -->


## Example 1
Lower case field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Ice cream is wonderful.",
    "schema": {
        "format": "lowercase"
    }
});
</script>
{% endraw %}


## Example 2
Lower case field rendered in a display-only view.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Ice cream is wonderful.",
    "schema": {
        "format": "lowercase"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}