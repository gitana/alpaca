---
layout: demo
title: New Customer - Simple Form
header: New Customer - Simple Form
framework: Twitter Bootstrap
---

This example loads <a href="simple-options.json" target="_source">options</a> and <a href="schema.json" target="_source">schema</a> parameters through ajax calls.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "optionsSource": "./simple-options.json",
        "schemaSource": "./schema.json",
        "view": "bootstrap-create"
    });
</script>
{% endraw %}
