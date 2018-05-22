---
layout: documentation-field
title: Phone Field
header: Phone Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```phone``` field.

This editor field requires <a target="_blank" href="https://github.com/excellalabs/jquery.maskedinput">jQuery Masked Input Plugin</a>

<!-- INCLUDE_API_DOCS: phone -->


## Example 1
Phone field with input mask.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "",
    "schema": {
        "format": "phone"
    }
});
</script>
{% endraw %}


## Example 2
Phone field with in display-only model.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "123-456-7890",
    "schema": {
        "format": "phone"
    },
    "options": {
        "label": "Phone Number"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}
