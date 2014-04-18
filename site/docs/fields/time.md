---
layout: documentation-field
title: Time Field
header: Time Field
group: navigation
---
{% include JB/setup %}


The ```time``` field is used to represent text within a form.


## Example 1
Time field with valid time.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "13:12:34",
    "schema": {
        "format": "time"
    }
});
</script>
{% endraw %}


## Example 2
Time field with invalid time.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "05:77:34",
    "options": {
        "type": "time"
    }
});
</script>
{% endraw %}


## Example 3
Time field in display-only mode.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
    $("#field3").alpaca({
        "data": "05:77:34",
        "options": {
            "type": "time"
        },
        "view": "bootstrap-display"
    });
</script>
{% endraw %}