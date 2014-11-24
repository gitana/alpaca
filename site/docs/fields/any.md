---
layout: documentation-field
title: Any Field
header: Any Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```any``` field.

<!-- INCLUDE_API_DOCS: any -->


## Example 1
Text field will be rendered for any data type if options parameter is not provided for the actual control field type.
Check out <a href="address-field.html">Combo Field Example</a> for how to render any data type with user specified control field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "",
    "schema": {
        "title": "Home Address",
        "type": "any"
    }
});
</script>
{% endraw %}


## Example 2
The Any field rendered in a display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "3900 Kirkland Street, Cambridge MA 02138",
    "schema": {
        "title": "Home Address",
        "type": "any"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}