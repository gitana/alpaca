---
layout: documentation-field
title: Color Field
header: Color Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```color``` field implements a color picker that runs on most modern browsers.  It allows for the selection
of hexadecimal color values using the browser's preferred color picker.

<!-- INCLUDE_API_DOCS: color -->


## Example 1
A color picker that lets us choose a color.  We use a postRender handler to show the value that was picked.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "#0077ff",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "color",
    },
    "postRender": function(control) {
        var showColorFn = function() {
            $("#color1").remove();
            $(control.getFieldEl()).after("<div id='color1'>The selected color is: " + control.getValue() + "</div>");
        };
        control.on("change", function() {
            showColorFn();
        });
        showColorFn();
    }
});
</script>
{% endraw %}

## Example 2
A color picker rendering in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "#0077ff",
    "view": "bootstrap-display",
    "options": {
        "label": "The selected color is",
        "type": "color"
    }
});
</script>
{% endraw %}