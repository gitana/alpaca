---
layout: demo
title: Customer Profile - Edit Form (Read Only)
header: Customer Profile - Edit Form (Read Only)
framework: Twitter Bootstrap
---

This example loads <a href="data.json" target="_source">data</a>, <a href="simple-options.json" target="_source">options</a> and <a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "dataSource": "./data.json",
        "optionsSource": "./simple-options.json",
        "schemaSource": "./schema.json",
        "view": {
            "parent": "bootstrap-edit",
            "displayReadonly": true
        }
    });
</script>
{% endraw %}
