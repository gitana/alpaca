---
layout: example
title: Customer Profile - Edit Form Example
header: Customer Profile - Edit Form Example
group: navigation
tags: field
framework: jQuery-UI
---

This example loads <a href="data.json" target="_source">data</a>, <a href="options.json" target="_source">options</a> and <a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "dataSource": "./data.json",
        "optionsSource": "./options.json",
        "schemaSource": "./schema.json"
    });
</script>
{% endraw %}