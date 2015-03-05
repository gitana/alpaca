---
layout: documentation-field
title: Table Field
header: Table Field
group: navigation
tags: field
---
{% include JB/setup %}

The ```table``` field.

The table field is useful when you have an array of data objects that have a uniform structure.  It provides a condensed
and table-based way of viewing data.  In editable mode, each table field has a toolbar at the top for adding new rows.
Each row in the table has an action bar.

The table field is an extension of the ArrayField and so all array field configuration options apply.

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


## Example 2
Here is a more advanced table with a few additional control types.  We wrap the form with a button that hands
back the underlying JSON.
<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": [{
        "key": "key1",
        "title": "title1",
        "amount": 2.53,
        "rating": "good"
    }, {
        "key": "key2",
        "title": "title2",
        "amount": 1.80,
        "rating": "poor"
    }, {
        "key": "key3",
        "title": "title3",
        "amount": 5.60,
        "rating": "excellent"
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
                },
                "approved": {
                    "type": "boolean",
                    "title": "Approved"
                },
                "rating": {
                    "type": "string",
                    "enum": ["poor", "good", "excellent"],
                    "title": "Rating"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "items": {
            "fields": {
                "rating": {
                    "type": "select"
                }
            }
        },
        "form": {
            "buttons": {
                "submit": {
                    "click": function() {
                        var value = this.getValue();
                        alert(JSON.stringify(value, null, "  "));
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}

## Example 3
Here is a table with the data shown in display mode.  When in display mode, the table does not show it's actions or
toolbar buttons.
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
    },
    "view": "bootstrap-display"
});
</script>
{% endraw %}


## Example 4
Here is a table with the data shown in read-only.  When in read-only mode, the table does not show it's actions or
toolbar buttons.
<div id="field4"> </div>
{% raw %}
<script type="text/javascript" id="field4-script">
$("#field4").alpaca({
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
        },
        "readonly": true
    },
    "options": {
        "type": "table"
    }
});
</script>
{% endraw %}



## Example 5
The table field uses the esteemed <a href="http://www.datatables.net" target="_blank">Data Tables Plugin</a>,
if available, to format the table and provide additional interaction features.  You can use the
<code>options.datatables</code> field to pass configuration information to the underlying Data Tables Plugin.
You can also set <code>options.datatables</code> to false to disable the Plugin.
<div id="field5"> </div>
{% raw %}
<script type="text/javascript" id="field5-script">
$("#field5").alpaca({
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
                    "title": "Clave"
                },
                "title": {
                    "type": "string",
                    "title": "Título"
                },
                "amount": {
                    "type": "number",
                    "title": "Costo"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "datatables": {
            "paging": false,
            "lengthChange": false,
            "info": true,
            "searching": false,
            "ordering": true,
            "autoWidth": false,
            "language": {
                "info": "Mira! Le ofrecemos _START_ to _END_ of _TOTAL_ cositas"
            }
        }
    }
});
</script>
{% endraw %}

## Example 6
You can disable the actions column by setting <code>showActionsColumn</code> to false.
<div id="field6"> </div>
{% raw %}
<script type="text/javascript" id="field6-script">
$("#field6").alpaca({
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
                    "title": "Clave"
                },
                "title": {
                    "type": "string",
                    "title": "Título"
                },
                "amount": {
                    "type": "number",
                    "title": "Costo"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "showActionsColumn": false
    }
});
</script>
{% endraw %}