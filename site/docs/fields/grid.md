---
layout: documentation-field
title: Grid Field
header: Grid Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```grid``` field.

<!-- INCLUDE_API_DOCS: grid -->


## Example 1
Grid field for an array of text items.
<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "data": [{
        "sku": "sku1",
        "name": "name1",
        "price": "price1",
        "quantity": "quantity1",
        "total": "total1"
    }, {
        "sku": "sku2",
        "name": "name2",
        "price": "price2",
        "quantity": "quantity2",
        "total": "total2"
    }, {
        "sku": "sku3",
        "name": "name3",
        "price": "price3",
        "quantity": "quantity3",
        "total": "total3"
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "sku": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                },
                "quantity": {
                    "type": "number"
                },
                "total": {
                    "type": "number"
                }
            }
        }
    },
    "options": {
        "type": "grid",
        "fields": {
            "sky": {
                "label": "SKU"
            },
            "name": {
                "label": "Name"
            },
            "price": {
                "label": "Price"
            },
            "quantity": {
                "label": "Quantity"
            },
            "total": {
                "label": "Total"
            }
        },
        "grid": {
            "rowHeaders": true,
            "colHeaders": true
        }
    }
});
</script>
{% endraw %}


