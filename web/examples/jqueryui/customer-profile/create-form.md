---
layout: example
title: New Customer Example
header: New Customer Example
group: navigation
tags: field
framework: jQuery-UI
---

This example loads <a href="options.json" target="_source">options</a> and <a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "schema": {
        "optionsSource": "./options.json",
        "schemaSource": "./schema.json",
        "view": "VIEW_WEB_CREATE"
    }
});
</script>
{% endraw %}