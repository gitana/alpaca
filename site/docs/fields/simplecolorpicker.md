---
layout: documentation-field
title: Simple Color Picker Field
header: Simple Color Picker Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```simplecolorpicker``` field implements a simple color picker that lets the end user choose from a selection of
colors.  It runs on Boostrap and relies on the following library:

    https://github.com/tkrotoff/jquery-simplecolorpicker
    
The <code>simplecolorpicker</code> option can be used to feed configuration settings to the plugin.

<!-- INCLUDE_API_DOCS: simplecolorpicker -->


## Example 1
A color picker that lets us choose a color.  We use a postRender handler to show the value that was picked.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "#bb9977",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "simplecolorpicker"
    },
    "postRender": function(control) {
        var showColorFn = function() {        
            $("#color1").remove();
            if (control.getValue()) {
                $(control.getFieldEl()).after("<div id='color1'>The selected color is: " + control.getValue() + "</div>");
            }
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
A color picker rendered with custom colors.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "#a4bdfc",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "simplecolorpicker",
        "colors": [{
            "value": "#a4bdfc",
            "label": "Blue"
        }, {
            "value": "#7ae7bf",
            "label": "Green"
        }, {
            "value": "#ff887c",
            "label": "Red"
        }, {
            "value": "#fafafa",
            "label": "White"        
        }, {
            "value": "#000000",
            "label": "Black"        
        }]
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
    "data": "#bb9977",
    "view": "bootstrap-display",
    "options": {
        "label": "The selected color is",
        "type": "simplecolorpicker"
    }
});
</script>
{% endraw %}