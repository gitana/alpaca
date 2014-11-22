---
layout: documentation-api
title: References
header: References
group: navigation
tags: field
---
{% include JB/setup %}

This page shows examples of using JSON schema <code>$ref</code> markup to reference
definitions and other structures within your JSON schema definition to generate
more complex and nested schema documents.

## Example #1: Nested Tree (using Array)

This example demonstrates the use of JSON Schema referencing to include or pull in
schema definitions from other parts of the document.  Alpaca supports referencing within
the same document using simple ids.

In this example, we allow the end user to create a tree structure of repeated leaf
elements that can be nested as many levels deep as they wish.

<div id="field1"> </div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
    "type": "create",
    "schema": {
        "id": "#leaf",
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Name",
                "required": true
            },
            "children": {
                "type": "array",
                "items": {
                    "$ref": "#leaf"
                }
            }
        }
    }
});
</script>
{% endraw %}


## Example #2: Deeply Nested Tree (loaded from data)

This example shows a deeply nested tree loaded with data.  Note that unlike the previous
example, this example uses a non-'create' view which allows data to bind.

<div id="field2"> </div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
    "data": [{
        "title": "Node 1.1",
        "children": [{
            "title": "Node 2.1",
            "children": [{
                "title": "Node 3.1",
                "children": [{
                    "title": "Node 4.1"
                }]
            }, {
                "title": "Node 3.2"
            }]
        }]
    }],
    "schema": {
        "id": "#leaf",
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "title": "Name",
                    "required": true
                },
                "children": {
                    "$ref": "#leaf"
                }
            }
        }
    },
    "options": {
        "toolbarSticky": true
    }
});
</script>
{% endraw %}


## Example #3: Internal Definitions

Here is an example of an object that derives one of its sub-object
properties from a referenced definition.  The definition is stored in a special
<code>definitions</code> sub-object of the schema.  This definitions sub-object
anticipates support for JSON Schema v4.

<div id="field3"> </div>
{% raw %}
<script type="text/javascript" id="field3-script">
$("#field3").alpaca({
    "type": "create",
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "title": "Name",
                "required": true
            },
            "info": {
                "$ref": "#/definitions/info"
            }
        },
        "definitions": {
            "info": {
                "type": "object",
                "title": "Additional Information",
                "properties": {
                    "author": {
                        "type": "string",
                        "title": "Author"
                    },
                    "review": {
                        "type": "string",
                        "enum": [
                            "Good",
                            "Bad",
                            "Ugly"
                        ],
                        "default": "Good"
                    }
                }
            }
        }
    }
});
</script>
{% endraw %}
