---
layout: documentation-field
title: Table Field
header: Table Field
group: navigation
tags: field
---
{% include JB/setup %}


The ```table``` field.


## Example 1
Table field for an array of text items.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
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
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "amount": {
                    "type": "number"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "fields": {
            "key": {
                "label": "Key"
            },
            "title": {
                "label": "Title"
            },
            "amount": {
                "label": "Amount"
            }
        }
    }
});
</script>
{% endraw %}


