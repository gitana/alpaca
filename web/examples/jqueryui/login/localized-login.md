---
layout: example
title: Localized Login Example
header: Localized Login Example
group: navigation
tags: field
framework: jQuery-UI
---

Localized simple login form with custom validation message and submit handler.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
    $("#field1").alpaca({
        "dataSource": "./data.json",
        "optionsSource": "./simple-options.json",
        "schemaSource": "./schema.json",
        "view": {
            "parent": "VIEW_WEB_EDIT",
            "displayReadonly": false
        }
    });
</script>
{% endraw %}
