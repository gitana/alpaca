---
layout: demo
title: Bookmarks Example
header: Bookmarks Example
framework: Twitter Bootstrap
---

This example loads the data, schema and options for the Alpaca form via AJAX.
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