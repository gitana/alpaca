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



## Example 2
Read-only table.  While in read-only mode, the table does not show it's actions column.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
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
        },
        "readonly": true
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

## Example 3
Empty table
<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
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
        },
        "readonly": true
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

