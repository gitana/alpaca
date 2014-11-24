---
layout: documentation-field
title: Password Field
header: Password Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```password``` field.

<!-- INCLUDE_API_DOCS: password -->


## Example 1
Password field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "password",
    "schema": {
        "format": "password"
    }
});
</script>
{% endraw %}


## Example 2
Password field in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "password",
    "schema": {
        "format": "password"
    },
    "options": {
        "label": "Password"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}