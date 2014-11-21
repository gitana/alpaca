---
layout: documentation-field
title: IPv4 Field
header: IPv4 Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```ipv4``` field.

<!-- INCLUDE_API_DOCS: ipv4 -->


## Example 1
IP address field.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": "100.60",
    "schema": {
        "format": "ip-address"
    }
});
</script>
{% endraw %}


## Example 2
IP address field rendered in display-only mode.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": "128.253.180.2",
    "schema": {
        "format": "ip-address"
    },
    "options": {
        "label": "IP Address"
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}
