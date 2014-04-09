---
layout: documentation-field
title: URL Field
header: URL Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```url``` field.


## Example 1
URL field with valid value.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "http://www.alpacajs.org",
    "options": {
        "type": "url"
    },
    "schema": {
        "format": "uri"
    }
});
</script>
{% endraw %}


## Example 2
URL field with invalid value.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "invalid url",
    "options": {
        "type": "url"
    },
    "schema": {
        "format": "uri"
    }
});
</script>
{% endraw %}


## Example 3
URL field - display only
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "http://www.cloudcms.com",
    "options": {
        "type": "url",
        "label": "Web Address"
    },
    "schema": {
        "format": "uri"
    },
    "view": "VIEW_BOOTSTRAP_DISPLAY"
});
</script>
{% endraw %}
