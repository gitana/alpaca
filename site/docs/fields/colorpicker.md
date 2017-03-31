---
layout: documentation-field
title: Color Picker Field
header: Color Picker Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```colorpicker``` field implements a color picker that runs on Bootstrap.  It relies on the following library:

    https://mjolnic.com/bootstrap-colorpicker/
    
The <code>colorpicker</code> option can be used to feed configuration settings to the plugin.

<!-- INCLUDE_API_DOCS: colorpicker -->


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
        "type": "colorpicker"
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
A color picker rendered in "component" mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "#0077ff",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "colorpicker",
        "component": true
    }
});
</script>
{% endraw %}

## Example 3
A color picker rendering in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "#0077ff",
    "view": "bootstrap-display",
    "options": {
        "label": "The selected color is",
        "type": "colorpicker"
    }
});
</script>
{% endraw %}