---
layout: documentation-field
title: Tag Field
header: Tag Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```tag``` field.

<!-- INCLUDE_API_DOCS: tag -->


## Example 1
<p>Tag field with valid input.</p>
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": ["great","wonderful","ice cream"],
    "options": {
        "type": "tag"
    }
});
</script>
{% endraw %}


## Example 2
Tag field in a display-only view.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
    $("#field2").alpaca({
        "data": ["great","wonderful","ice cream"],
        "options": {
            "type": "tag"
        },
        "view": "bootstrap-display"
    });
</script>
{% endraw %}