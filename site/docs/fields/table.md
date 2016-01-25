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

## Example 7

Mix table with interesting control types for inline editing.  Here, we maintain a <code>rank</code> property that
auto-updates as fields move around.  The "Show JSON" button in the form lets us see the resulting JSON for the table.
<div id="field7"> </div>
{% raw %}
<script type="text/javascript" id="field7-script">
$("#field7").alpaca({
    "data": [{
        "rank": 1,
        "name": "Michael Jordan",
        "sport": "basketball",
        "active": false,
        "number": 23
    }, {
        "rank": 2,
        "name": "Pele",
        "sport": "soccer",
        "active": false,
        "number": 10
    }, {
        "rank": 3,
        "name": "Wayne Gretzky",
        "sport": "hockey",
        "active": false,
        "number": 99
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "rank": {
                    "type": "number",
                    "title": "Rank",
                    "readonly": true
                },
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "sport": {
                    "type": "string",
                    "title": "Sport",
                    "enum": [
                        "basketball",
                        "baseball",
                        "hockey",
                        "soccer",
                        "football"
                    ]
                },
                "active": {
                    "type": "boolean",
                    "title": "Active",
                    "enum": [true, false]
                },
                "number": {
                    "type": "number",
                    "title": "Number"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "items": {
            "fields": {
                "name": {
                    "type": "personalname"
                },
                "sport": {
                    "type": "select",
                    "optionLabels": [
                        "Basketball",
                        "Baseball",
                        "Hockey",
                        "Soccer",
                        "Football"
                    ]
                },
                "active": {
                    "type": "select",
                    "optionLabels": ["Yep", "Nope"]
                },
                "number": {
                    "type": "integer"
                }
            }
        },
        "datatables": {
            "searching": true
        },
        "toolbarSticky": true,
        "form": {
            "buttons": {
                "submit": {
                    "title": "Show JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }
            }
        }
    },
    "postRender": function(control) {
        control.on("move", function() {
            for (var i = 0; i < control.children.length; i++) {
                control.children[i].childrenByPropertyId["rank"].setValue(i + 1);
            }
        });
    }
});
</script>
{% endraw %}

## Example 8

Adding and removing rows dynamically using setValue.
<div id="field8"> </div>
{% raw %}
<script type="text/javascript" id="field8-script">
var dtConfig8 = {
    "searching": true
};
$("#field8").alpaca({
    "data": [{
        "name": "Michael Jordan",
        "sport": "basketball",
        "number": 23
    }, {
        "name": "Pele",
        "sport": "soccer",
        "number": 10
    }, {
        "name": "Wayne Gretzky",
        "sport": "hockey",
        "number": 99
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "sport": {
                    "type": "string",
                    "title": "Sport",
                    "enum": [
                        "basketball",
                        "baseball",
                        "hockey",
                        "soccer",
                        "football"
                    ]
                },
                "number": {
                    "type": "number",
                    "title": "Number"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "items": {
            "fields": {
                "name": {
                    "type": "personalname"
                },
                "sport": {
                    "type": "select",
                    "optionLabels": [
                        "Basketball",
                        "Baseball",
                        "Hockey",
                        "Soccer",
                        "Football"
                    ]
                },
                "number": {
                    "type": "integer"
                }
            }
        },
        "datatables": dtConfig8,
        "toolbarSticky": true,
        "form": {
            "buttons": {
                "addRow": {
                    "title": "Add Row",
                    "click": function() {
                        var value = this.getValue();
                        value.push({
                            "name": "New Athlete",
                            "sport": "basketball",
                            "number": 99
                        });
                        this.setValue(value);
                    }
                },
                "removeRow": {
                    "title": "Remove Row",
                    "click": function() {
                        var value = this.getValue();
                        if (value.length > 0) {
                            value.pop();
                            this.setValue(value);
                        }                        
                    }
                },
                "submit": {
                    "title": "Show JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }                          
            }
        }        
    }
});
</script>
{% endraw %}

## Example 9

Drag-and-drop support for draggable table row re-ordering using the <code>dragRows</code> option.
Set <code>dragRows</code> to <code>true</code> to enable draggable rows within your table.
 
NOTE: This feature currently requires the <code>datatables.net-rowreorder</code> plugin as well as the core <code>datatables.net</code> library.

See the <a href="https://datatables.net/extensions/rowreorder/" target="_blank">DataTables RowReorder Plugin</a> for more information.

If you run into problems with the placement of the draggable overlay, you may need to force absolute positioning of the
overlay like this:

````
.table.dt-rowReorder-float
{
    position: absolute !important;
}
````

NOTE: This feature is experimental and may change in the future.  We're not altogether that happy with the 
DataTables RowReorder Plugin and may seek to implement differently.  However, the <code>dragRows</code> option will
continue to work as it does currently and will be supported in the future.

<div id="field9"> </div>
{% raw %}
<script type="text/javascript" id="field9-script">
$("#field9").alpaca({
    "data": [{
        "name": "Michael Jordan",
        "sport": "basketball",
        "number": 23
    }, {
        "name": "Pele",
        "sport": "soccer",
        "number": 10
    }, {
        "name": "Wayne Gretzky",
        "sport": "hockey",
        "number": 99
    }],
    "schema": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "sport": {
                    "type": "string",
                    "title": "Sport",
                    "enum": [
                        "basketball",
                        "baseball",
                        "hockey",
                        "soccer",
                        "football"
                    ]
                },
                "number": {
                    "type": "number",
                    "title": "Number"
                }
            }
        }
    },
    "options": {
        "type": "table",
        "items": {
            "fields": {
                "name": {
                    "type": "personalname"
                },
                "sport": {
                    "type": "select",
                    "optionLabels": [
                        "Basketball",
                        "Baseball",
                        "Hockey",
                        "Soccer",
                        "Football"
                    ]
                },
                "number": {
                    "type": "integer"
                }
            }
        },
        "dragRows": true,
        "form": {
            "buttons": {
                "submit": {
                    "title": "Show JSON",
                    "click": function() {
                        alert(JSON.stringify(this.getValue(), null, "  "));
                    }
                }                          
            }
        }
    }
});
</script>
{% endraw %}

<style>
/** we override this here since the DataTables row-reorder plugin seems to miscalculate the DOM position and height on our samples page **/
.table.dt-rowReorder-float
{
    position: absolute !important;
}
</style>

