---
layout: documentation-field
title: Pick A Color Field
header: Pick A Color Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```pickacolor``` field implements a simple color picker that lets the end user choose from a selection of
colors.  It runs on Botostrap and relies on the following library:

    Uses: https://github.com/billyaraujo/pick-a-color
    
The <code>pickacolor</code> option can be used to feed configuration settings to the plugin.

<!-- INCLUDE_API_DOCS: pickacolor -->


## Example 1
A color picker that lets us choose a color.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "#bb9977",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "pickacolor"
    }
});
</script>
{% endraw %}

## Example 2
A color picker rendered with custom colors and some custom options.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "#a4bdfc",
    "schema": {
        "type": "string"
    },
    "options": {
        "type": "pickacolor",
        "pickacolor": {
            showSpectrum          : false,
            showSavedColors       : false,
            saveColorsPerElement  : false,
            fadeMenuToggle        : false,
            showAdvanced          : false,
            showBasicColors       : true,
            showHexInput          : false,
            allowBlank            : false        
        },
        "colors": {
            "blue": "2980b9",
            "green": "27ae60",
            "red": "c0392b",
            "white": "ecf0f1",
            "black": "000000"
        }
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
        "type": "pickacolor"
    }
});
</script>
{% endraw %}