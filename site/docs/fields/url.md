---
layout: documentation-field
title: URL Field
header: URL Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```url``` field.

<!-- INCLUDE_API_DOCS: url -->


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
URL field - with field set to display mode.  Override the anchor title and anchor target.
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": "http://www.cloudcms.com",
    "schema": {
        "format": "uri"
    },
    "options": {
        "type": "url",
        "anchorTitle": "Cloud CMS",
        "anchorTarget": "_blank",
        "view": "bootstrap-display"
    }
});
</script>
{% endraw %}


## Example 4
URL field - display only view
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
    "data": "http://www.cloudcms.com",
    "options": {
        "type": "url",
        "label": "Web Address"
    },
    "schema": {
        "format": "uri"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}
