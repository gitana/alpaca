---
layout: documentation-field
title: Country Field
header: Country Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```country``` field.


## Example 1
Country field with default settings.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "options": {
        "type": "country"
    }
});
</script>
{% endraw %}


## Example 2
Country field with names capitalized.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "options": {
        "type": "country",
        "capitalize": true
    }
});
</script>
{% endraw %}


## Example 3
Country field rendered in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "USA",
    "options": {
        "type": "country",
        "label": "Country"
    },
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>
{% endraw %}