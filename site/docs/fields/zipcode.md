---
layout: documentation-field
title: Zip Code Field
header: Zip Code Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```zipcode``` field.

<!-- INCLUDE_API_DOCS: zipcode -->


## Example 1
Zipcode field with 5-digit validation.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "53221",
    "options": {
        "type": "zipcode",
        "format": "five"
    }
});
</script>
{% endraw %}


## Example 2
Zipcode field with 9-digit validation.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "53221",
    "options": {
        "type": "zipcode",
        "format": "nine"
    }
});
</script>
{% endraw %}


## Example 3
Zipcode field with 5-digit invalid value.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "BOOYA",
    "options": {
        "type": "zipcode",
        "format": "five"
    }
});
</script>
{% endraw %}


## Example 4
Displays the zip code field using a display-only view.
<div id="field4"></div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "53221",
    "options": {
        "type": "zipcode",
        "format": "five",
        "label": "Zip Code"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}
