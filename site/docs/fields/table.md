---
layout: documentation-field
title: Table Field
header: Table Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```table``` field.

<!-- INCLUDE_API_DOCS: table -->



## Example 3
Empty table
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "data": [{
        "key": "key1",
        "title": "title1",
        "amount": 2.53
    }, {
        "key": "key2",
        "title": "title2",
        "amount": 1.80
    }, {
        "key": "key3",
        "title": "title3",
        "amount": 5.60
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string",
                    "title": "Key"
                },
                "title": {
                    "type": "string",
                    "title": "Title"
                },
                "amount": {
                    "type": "number",
                    "title": "Amount"
                }
            }
        }
    },
    "options": {
        "type": "table"
    }
});
</script>
{% endraw %}

