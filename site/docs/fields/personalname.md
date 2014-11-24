---
layout: documentation-field
title: Personal Name Field
header: Personal Name Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```personalname``` field.

<!-- INCLUDE_API_DOCS: personalname -->


## Example 1
Personal name field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "Oscar Zoroaster Phadrig Isaac Norman Henkel Emmannuel Ambroise Diggs",
    "options": {
        "type": "personalname"
    }
});
</script>
{% endraw %}


## Example 2
Personal name field in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "Oscar Zoroaster Phadrig Isaac Norman Henkel Emmannuel Ambroise Diggs",
    "options": {
        "type": "personalname",
        "label": "Name"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}