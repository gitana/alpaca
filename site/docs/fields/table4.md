---
layout: documentation-field
title: Table Field
header: Table Field
group: navigation
tags: field
---
{% include JB/setup %}

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

<style>
/** we override this here since the DataTables row-reorder plugin seems to miscalculate the DOM position and height on our samples page **/
.table.dt-rowReorder-float
{
    position: absolute !important;
}
</style>

