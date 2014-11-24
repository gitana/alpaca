---
layout: documentation-field
title: Email Field
header: Email Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```email``` field.

<!-- INCLUDE_API_DOCS: email -->


## Example 1
Email field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "support",
    "schema": {
        "format": "email"
    }
});
</script>
{% endraw %}


## Example 2
Email field rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "support",
    "schema": {
        "format": "email"
    },
    "options": {
        "label": "Email Address"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}